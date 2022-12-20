const { map } = require('mathjs');

module.exports = {
    
    name: 'balance',
    description: 'Balances a chemical reaction',
    usage: '+balance [unbalanced equation] (use this format: H2 + O2 = H2O)',
    async execute(client, message, args) {
        let balance = require('reaction-balancer');


        const reaction = args.join('');
        const parsedReaction = parseReaction(reaction);
       // console.log(parsedReaction); // Outputs: { reactants: ['2H2', 'O2'], products: ['2H2O'] }
       // message.channel.send(`Logged Information. ${parsedReaction}`);
  

        // H2 + O2 -> H2O
        const rxn = {
            reactants: parsedReaction.reactants,
            products: parsedReaction.products,
        };
        const coeffs = balance(rxn);
        message.channel.send(`Balanced Reaction: ${mapToEquationString(coeffs)} `)
        // console.log(coeffs)

    }
  };
  
  function parseReaction(reaction) {
    const reactants = [];
    const products = [];
  
    // Split the reaction into left and right sides
    const sides = reaction.split('=');
    const left = sides[0].trim();
    const right = sides[1].trim();
  
    // Split the left and right sides into individual compounds
    const leftCompounds = left.split('+');
    const rightCompounds = right.split('+');
  
    // Add the compounds to the reactants or products arrays
    leftCompounds.forEach((compound) => reactants.push(compound.trim()));
    rightCompounds.forEach((compound) => products.push(compound.trim()));
  
    return { reactants, products };
  }
  const mapToEquationString = (map) => {
    const reactants = Array.from(map).filter(([, { type }]) => type === "reactant");
    const products = Array.from(map).filter(([, { type }]) => type === "product");
  
    const reactantString = reactants
      .map(([compound, { coefficient }]) => `${coefficient} ${compound}`)
      .join(" + ");
    const productString = products
      .map(([compound, { coefficient }]) => `${coefficient} ${compound}`)
      .join(" + ");
  
    return `${reactantString} => ${productString}`;
  };
  

  
  
