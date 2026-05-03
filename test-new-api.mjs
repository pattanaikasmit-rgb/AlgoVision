// Test new Gemini API key
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testNewAPIKey() {
  try {
    console.log("Testing new Gemini API key...");
    
    // Initialize with the new API key
    const genAI = new GoogleGenerativeAI("AIzaSyDrYbFe7Bch_lPis7jn0MNU-h1tRmN39gQ");
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Test prompt
    const prompt = "Hello, can you respond with 'API working' if you receive this?";
    
    console.log("Sending request to Gemini API with new key...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ API Response:", text);
    console.log("✅ New Gemini API key is working!");
    
  } catch (error) {
    console.error("❌ API Error:", error.message);
    console.error("Full error:", error);
  }
}

testNewAPIKey();
