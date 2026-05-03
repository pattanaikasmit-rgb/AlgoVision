// Test Gemini API directly
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API...");
    
    // Initialize with your API key
    const genAI = new GoogleGenerativeAI("AIzaSyCP5xHDImY4oBvVlPISwCwHornGu3piHs4");
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Test prompt
    const prompt = "Hello, can you respond with 'API working' if you receive this?";
    
    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ API Response:", text);
    console.log("✅ Gemini API is working!");
    
  } catch (error) {
    console.error("❌ API Error:", error.message);
    console.error("Full error:", error);
  }
}

testGeminiAPI();
