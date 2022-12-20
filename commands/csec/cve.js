const request = require('request');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cve',
  description: 'Searches for information about a given CVE',
  args: true,
  usage: '+cve `cve-####-####`',
  async execute(client, message, args) {
    // Extract the CVE number from the arguments
    const cve = args[0];

    // Send a request to the CVE search API
    request(`https://cve.circl.lu/api/cve/${cve}`, (error, response, body) => {
      if (error) {
        console.error(error);
        return message.channel.send(`An error occurred while searching for information about CVE ${cve}`);
      }

      // Extract the desired information from the response data
      const data = JSON.parse(body);
      console.log(data)
      if (!data) {
        // Send a message indicating that no CVE was found
        console.log("nodat")
        const embed = new EmbedBuilder()
          .setTitle(`No information found for CVE ${cve}`)
          .setDescription(
            'The National Vulnerability Database (NVD) may not have information about this particular CVE. This could be because the CVE is new or it has not yet been added to the NVD.'
          )
          .setColor(0x0099ff);

        return message.channel.send({ embeds:[embed] });
      }
      console.log("datdat")

      const published = data.Published;
      const modified = data.Modified;
      const id = data.id;
      const summary = data.summary;
      let references = data.references;

      // Trim the references list if it is too long
      while (references.join(' ').length > 1000) {
        const lastIndex = references.length - 1;
        if (references[lastIndex].startsWith('http')) {
          references.splice(lastIndex, 1);
        } else {
          break;
        }
      }

      // Construct an embed message with the extracted information
      const embed = new EmbedBuilder()
        .setTitle(`Information about CVE ${cve}`)
        .addFields(
          { name: 'ID:', value: id },
          { name: 'Summary:', value: summary },
          { name: 'References:', value: references.join('\n') },
          { name: 'Published:', value: published },
          { name: 'Modified:', value: modified }
        )
        .setColor(0x0099ff);

      // Send the message to the user
      message.channel.send({ embeds:[embed] });
    });
  },
};
