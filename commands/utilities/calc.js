const math = require('mathjs');

module.exports = {
    name: 'calc',
    description: 'Calculates a mathematical equation',
    usage:'+calc equation',
    execute(client, message, args) {
        // If no arguments are supplied, send a message to the channel
        if (args.length === 0) {
            return message.channel.send('Please provide an equation to calculate.');
        }

        // Join the args array into a single string
        const equation = args.join(' ');

        try {
            // Use mathjs to evaluate the equation, with support for square roots, exponents, and fractions
            const result = math.evaluate(equation, {
                fraction: true,
                squareRoot: true,
                exponents: true,
                factorials:true
            });

            // Send the result to the channel
            message.channel.send(`The result is: ${result}`);
        } catch (error) {
            // If there was an error, send a message to the channel
            message.channel.send(`Could not calculate equation: ${error.message}`);
        }
    },
};
