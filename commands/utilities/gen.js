/*
Write a product description for an 3.3 borosilicate glass flat bottom boiling flask offered by CELL (Chemical Experimentation Laboratories and Labor). The product is a laboratory glassware borosilicate 3.3 glassmand its key features include:

Our boiling flasks are made from low-expansion borosilicate glass. Feature uniform wall thickness for superior mechanical strength and shock resistance.

Properties of Glassware and Plasticware
Item # 	Capacity (ml) 	Approx. O.D. x Height (mm) 	Quantity Per Pack 	Quantity Per Case
FG4060-50 	50 	51 x 90 	6 	24
FG4060-100 	100 	64 x 105 	6 	24
FG4060-150 	150 	74 x 112 	6 	24
FG4060-250 	250 	85 x 138 	6 	24
FG4060-300 	300 	88 x 143 	6 	24
FG4060-500 	500 	105 x 163 	6 	24
FG4060-1000 	1000 	131 x 190 	1 	6
FG4060-2000 	2000 	166 x 230 	1 	6
FG4060-3000 	3000 	185 x 250 	1 	1
FG4060-5000 	5000 	223 x 290 	1 	1
The description should highlight the product's unique selling points and how it stands out from competitor products. Emphasize the benefits of using 3.3 borosilicate glass flat bottom boiling flasks in the laboratory, and why it would be a valuable investment for laboratory professionals and amateurs alike.
End the description with a call to action, encouraging the reader to learn more or make a purchase. Make sure to mention the product's price and availability.*/
module.exports = {
    name: 'gen',
    description: 'generates product query for gpt',
    usage: '+gen "product name" "product category/type" "list key features"',
    execute(client, message, args) {
        // Check if user input contains all required values
        if (args.length < 3) {
            return message.reply('Please provide a valid product name, category/type, and key features list.');
        }
        
        // Retrieve user input values
        const regex = /"([^"]+)"/g;
        const matches = args.join(' ').match(regex);
        if (matches.length < 3) {
            return message.reply('Please provide a valid product name, category/type, and key features list enclosed in double quotes.');
        }
        const productName = matches[0].replace(/"/g, '');
        const productCategory = matches[1].replace(/"/g, '');
        const keyFeatures = matches[2].replace(/"/g, '');

        // Generate product description
        const productDescription = `Write a product description for ${productName}, offered by CELL (Chemical Experimentation Laboratories and Labor). The product is a ${productCategory} and its key features include ${keyFeatures}. This product stands out from competitors due to its [unique selling points]. It is a valuable investment for laboratory professionals as it [benefits of using the product in the laboratory]. 
        
        [Call to action], and the product is priced at [product price] and currently [availability].`;

        // Send generated product description in Discord channel
        message.channel.send("desc logged");
        console.log(productDescription);

    },
};
