import vision from "@google-cloud/vision";

async function testVision() {
  try {
    // Create Vision client
    const client = new vision.ImageAnnotatorClient();

    // Replace with an actual image file path from your computer
    const [result] = await client.labelDetection("./test.jpg");

    console.log("Labels:");
    result.labelAnnotations.forEach(label => {
      console.log(`- ${label.description} (score: ${label.score})`);
    });
  } catch (err) {
    console.error("❌ Vision API Error:", err.message);
  }
}

testVision();
