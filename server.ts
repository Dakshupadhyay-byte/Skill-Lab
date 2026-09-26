import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parsing with limits for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Shared server-side Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const studyKitSchema = {
  type: Type.OBJECT,
  properties: {
    materialTitle: {
      type: Type.STRING,
      description: 'A concise descriptive title summarizing the study material topic.',
    },
    keyConcepts: {
      type: Type.ARRAY,
      description: 'Extract 3 to 5 core concepts from the provided material. Explain each concept in 2–3 concise sentences using plain, easy-to-understand language.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Core concept name or term.',
          },
          explanation: {
            type: Type.STRING,
            description: '2–3 concise sentences explaining the concept in plain, accessible language.',
          },
        },
        required: ['title', 'explanation'],
      },
    },
    practiceQuestions: {
      type: Type.OBJECT,
      description: 'Generate 3 distinct questions based directly on the source material according to the requested difficulty level.',
      properties: {
        mcq: {
          type: Type.OBJECT,
          description: 'Multiple Choice Question (MCQ) with 4 options and marked correct answer with a brief explanation.',
          properties: {
            question: { type: Type.STRING, description: 'The multiple choice question prompt.' },
            options: {
              type: Type.ARRAY,
              description: 'Array of exactly 4 choices (A, B, C, D).',
              items: { type: Type.STRING },
            },
            correctOptionIndex: {
              type: Type.INTEGER,
              description: 'Zero-based index of the correct option (0, 1, 2, or 3).',
            },
            explanation: {
              type: Type.STRING,
              description: 'Brief explanation of why this option is correct based on the material.',
            },
          },
          required: ['question', 'options', 'correctOptionIndex', 'explanation'],
        },
        shortAnswer: {
          type: Type.OBJECT,
          description: 'Short Answer Question with a sample high-scoring answer.',
          properties: {
            question: { type: Type.STRING, description: 'The short answer question prompt.' },
            sampleAnswer: {
              type: Type.STRING,
              description: 'A sample high-scoring answer directly grounded in the material.',
            },
            keyPointsToInclude: {
              type: Type.ARRAY,
              description: '2 to 4 bullet points that a student must mention for full marks.',
              items: { type: Type.STRING },
            },
          },
          required: ['question', 'sampleAnswer'],
        },
        conceptualApplication: {
          type: Type.OBJECT,
          description: 'Conceptual Application Question asking how a key concept applies to a real-world scenario.',
          properties: {
            scenario: {
              type: Type.STRING,
              description: 'A concrete, relatable real-world situation or case study.',
            },
            question: {
              type: Type.STRING,
              description: 'How a key concept from the material applies or solves the scenario.',
            },
            guidedApplication: {
              type: Type.STRING,
              description: 'Detailed high-scoring explanation showing how the concept governs this scenario.',
            },
          },
          required: ['scenario', 'question', 'guidedApplication'],
        },
      },
      required: ['mcq', 'shortAnswer', 'conceptualApplication'],
    },
    flashcards: {
      type: Type.ARRAY,
      description: 'Flashcard set of key terms and concepts. MUST contain between 5 and 10 flashcards total.',
      items: {
        type: Type.OBJECT,
        properties: {
          front: {
            type: Type.STRING,
            description: 'Term or Question on the front of the flashcard.',
          },
          back: {
            type: Type.STRING,
            description: 'Definition or Answer on the back of the flashcard.',
          },
        },
        required: ['front', 'back'],
      },
    },
    formattedLayoutText: {
      type: Type.STRING,
      description: 'The raw formatted text matching the requested markdown layout with sections #1. Key Concepts & Summaries, #2. Practice Exam Questions, #3. Flashcard Set (JSON Format).',
    },
  },
  required: ['materialTitle', 'keyConcepts', 'practiceQuestions', 'flashcards', 'formattedLayoutText'],
};

// API Route: Generate study kit
app.post('/api/study-kit/generate', async (req, res) => {
  try {
    const { text, image, difficulty = 'medium' } = req.body;

    if (!text && !image) {
      return res.status(400).json({
        error: 'Please provide study material text, notes, or an uploaded document image.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured.',
      });
    }

    const validDifficulty = ['easy', 'medium', 'hard'].includes(difficulty)
      ? difficulty
      : 'medium';

    const systemInstruction = `You are an expert academic tutor and exam preparation assistant.
Your goal is to transform raw study materials (text, notes, or uploaded document images) into an actionable, structured study kit.

Always structure your response using the following layout and constraints:

#1. Key Concepts & Summaries
- Extract 3–5 core concepts strictly from the provided material.
- Explain each concept in 2–3 concise sentences using plain, easy-to-understand language.

#2. Practice Exam Questions
Generate 3 distinct questions based directly on the source material:
- "Multiple Choice Question (MCQ)": Provide 4 options and mark the correct answer with a brief explanation.
- "Short Answer Question": Provide a sample high-scoring answer.
- "Conceptual Application Question": Ask how a key concept applies to a real-world scenario.

#3. Flashcard Set (JSON Format)
Format the key terms as a clean JSON array so the frontend can parse them into flashcards:
[
  {
    "front": "Term or Question",
    "back": "Definition or Answer"
  }
]

#4. Constraints
- Create the questions from the uploaded material ONLY. Do not reference the internet or search for more information.
- Do NOT hallucinate concepts. If the concept is not available in the material, do NOT include it in the final quiz.
- Ensure the total number of flashcards is strictly between five and ten (5 <= total <= 10).
- The current question difficulty setting is: "${validDifficulty.toUpperCase()}".
  * EASY: Focus on direct recall, clear foundational definitions, and straightforward distinctions.
  * MEDIUM: Focus on conceptual understanding, cause-and-effect, and standard application.
  * HARD: Focus on deep analysis, edge cases explicitly in the text, tricky distractors, and cross-concept synthesis.
- Ensure token consumption is concise and focused to stay well within free tier limits.`;

    const contentsParts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

    if (image && image.data) {
      // Strip data URL header if present
      let rawBase64 = image.data;
      let mimeType = image.mimeType || 'image/png';
      if (rawBase64.includes('base64,')) {
        const match = rawBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          rawBase64 = match[2];
        } else {
          rawBase64 = rawBase64.split('base64,')[1];
        }
      }

      contentsParts.push({
        inlineData: {
          mimeType,
          data: rawBase64,
        },
      });
    }

    let userPromptText = `Please parse the attached study material and generate the complete structured study kit.
Difficulty level: ${validDifficulty}.`;

    if (text && text.trim().length > 0) {
      userPromptText += `\n\n--- SOURCE STUDY MATERIAL TEXT ---\n${text.trim()}\n--- END OF MATERIAL ---`;
    }

    contentsParts.push({
      text: userPromptText,
    });

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: unknown = null;
    let responseText: string | undefined;

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: {
              parts: contentsParts,
            },
            config: {
              systemInstruction,
              temperature: 0.2, // Low temperature for strict adherence to source material & zero hallucination
              responseMimeType: 'application/json',
              responseSchema: studyKitSchema,
            },
          });

          responseText = response.text;
          if (responseText) {
            break;
          }
        } catch (err: unknown) {
          lastError = err;
          const errString = err instanceof Error ? err.message : JSON.stringify(err);
          const isTransient =
            errString.includes('503') ||
            errString.includes('429') ||
            errString.includes('UNAVAILABLE') ||
            errString.includes('high demand') ||
            (typeof err === 'object' && err !== null && ('status' in err && (err as { status: number }).status === 503));

          if (isTransient && attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }
          break;
        }
      }

      if (responseText) {
        break;
      }
    }

    if (!responseText) {
      const errorMsg = lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(errorMsg || 'Gemini API returned an empty response.');
    }

    const parsedData = JSON.parse(responseText);

    // Validate flashcards count constraint (between 5 and 10)
    if (Array.isArray(parsedData.flashcards)) {
      if (parsedData.flashcards.length > 10) {
        parsedData.flashcards = parsedData.flashcards.slice(0, 10);
      }
    }

    // Return the response object to client
    res.json({
      success: true,
      data: {
        ...parsedData,
        difficulty: validDifficulty,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    console.error('Error generating study kit:', errorMsg);
    res.status(500).json({
      error: errorMsg || 'Failed to generate study kit. Please check your input and try again.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`StudyKit AI server running on http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
