export function getProofData() {
  // To get the data back from localStorage generate ZK
  const storedProofData = localStorage.getItem("proofData");
  const parsedProofData = storedProofData ? JSON.parse(storedProofData) : null;

  // Extract and parse the YouTube response to get items
  let youtubeItems = null;
  if (parsedProofData?.proof?.extractedParameterValues?.data) {
    try {
      const dataString = parsedProofData.proof.extractedParameterValues.data;

      // Find the JSON part (after the HTTP headers)
      const jsonStart = dataString.indexOf("{");
      const jsonEnd = dataString.lastIndexOf("}") + 1;

      if (jsonStart !== -1 && jsonEnd > 0) {
        const jsonString = dataString.substring(jsonStart, jsonEnd);
        const youtubeResponse = JSON.parse(jsonString);

        // Extract only the items array
        youtubeItems = youtubeResponse.items || [];

        console.log("YouTube Items:", youtubeItems);

        // Get the first channel info if available
        if (youtubeItems.length > 0) {
          const channel = youtubeItems[0];
          console.log("Channel Title:", channel.snippet?.title);
          console.log(
            "Channel Thumbnail:",
            channel.snippet?.thumbnails?.high?.url
          );

          return {
            channelTitle: channel.snippet?.title,
            channelThumbnail: channel.snippet?.thumbnails?.high?.url,
          };
        }
      }
    } catch (error) {
      console.error("Error parsing YouTube data:", error);
    }
  }
}
