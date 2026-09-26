export interface SampleNote {
  id: string;
  category: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  snippet: string;
  fullText: string;
}

export const SAMPLE_STUDY_MATERIALS: SampleNote[] = [
  {
    id: 'bio-photo',
    category: 'Biology',
    title: 'Photosynthesis & Cellular Respiration',
    difficulty: 'medium',
    snippet: 'Light-dependent reactions in thylakoids, Calvin cycle in stroma, and ATP synthase...',
    fullText: `Photosynthesis and Cellular Energy Transfer:
Photosynthesis is the biochemical process by which autotrophic organisms convert light energy into chemical energy stored in glucose. In eukaryotes, this occurs inside chloroplasts. The process has two major stages: light-dependent reactions and the Calvin cycle (light-independent reactions).

Light-Dependent Reactions:
Occur in the thylakoid membranes. Chlorophyll pigments in photosystems II and I absorb photons, exciting electrons that travel through an electron transport chain (ETC). Photolysis of water (H2O -> 2H+ + 1/2 O2 + 2e-) replenishes lost electrons, releasing oxygen gas as a byproduct. The flow of protons across the thylakoid membrane drives ATP synthase to produce ATP, while NADP+ is reduced to NADPH.

The Calvin Cycle:
Takes place in the stroma. The enzyme RuBisCO catalyzes carbon fixation by binding atmospheric CO2 to ribulose 1,5-bisphosphate (RuBP). Using ATP and NADPH generated during the light reactions, 3-PGA is converted to G3P (glyceraldehyde 3-phosphate), which is synthesized into glucose and other carbohydrates. RuBP is then regenerated to continue the cycle.

Cellular Respiration Link:
Plant and animal cells utilize mitochondria to break down glucose via glycolysis, the citric acid cycle, and oxidative phosphorylation, generating ATP through chemiosmosis with oxygen acting as the final electron acceptor.`,
  },
  {
    id: 'cs-neural',
    category: 'Computer Science',
    title: 'Neural Networks & Backpropagation',
    difficulty: 'hard',
    snippet: 'Perceptrons, non-linear activations (ReLU, Sigmoid), cost functions, and gradient descent...',
    fullText: `Artificial Neural Networks and Gradient Optimization:
An artificial neural network (ANN) is a computational model inspired by biological neural circuits. A basic unit, the artificial neuron or perceptron, receives input signals x_i, applies learnable weights w_i and a bias b, and computes an affine transformation z = sum(w_i * x_i) + b.

Activation Functions:
To enable deep networks to learn non-linear decision boundaries, activation functions are applied element-wise. Common choices include the Rectified Linear Unit (ReLU: f(z) = max(0, z)), which mitigates the vanishing gradient problem, and the Sigmoid function (f(z) = 1 / (1 + e^-z)), which maps real values to probabilities in (0, 1).

Loss Functions and Gradient Descent:
During supervised training, predictions are compared with ground-truth targets using a loss function L (e.g., Mean Squared Error for regression, Categorical Cross-Entropy for classification). The objective is to minimize L over the parameter space using gradient descent, updating parameters along the negative gradient: w = w - alpha * grad_w(L), where alpha is the learning rate.

Backpropagation:
Backpropagation applies the calculus chain rule recursively from the output layer backwards through hidden layers. It computes partial derivatives of the loss with respect to every weight and bias, allowing stochastic gradient descent (SGD) or adaptive optimizers (like Adam) to efficiently train multi-layer architectures.`,
  },
  {
    id: 'econ-markets',
    category: 'Economics',
    title: 'Market Equilibrium & Price Elasticity',
    difficulty: 'easy',
    snippet: 'Law of demand and supply, equilibrium price, shifts vs movements, and price elasticity...',
    fullText: `Fundamentals of Market Equilibrium and Elasticity:
The law of demand states that, ceteris paribus (all other things being equal), as the price of a good increases, the quantity demanded decreases. Conversely, the law of supply states that as price increases, producers are willing to supply a higher quantity to the market.

Market Equilibrium:
Equilibrium occurs at the intersection of the downward-sloping demand curve and the upward-sloping supply curve. At the equilibrium price (P*), quantity demanded equals quantity supplied (Q*). If the price is set above equilibrium, quantity supplied exceeds quantity demanded, creating an excess supply or surplus. If price is below equilibrium, quantity demanded exceeds supply, causing a shortage.

Shifts versus Movements:
A change in a good's own price causes a movement along existing supply or demand curves. In contrast, external determinants—such as consumer income, tastes, technology, or production costs—cause the entire curve to shift rightward (increase) or leftward (decrease).

Price Elasticity of Demand (PED):
Price elasticity of demand measures the responsiveness of quantity demanded to a percentage change in price (% change in Q / % change in P). Goods with close substitutes typically exhibit elastic demand (|PED| > 1), whereas essential goods with few substitutes exhibit inelastic demand (|PED| < 1).`,
  },
];
