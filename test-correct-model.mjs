// Test new Gemini API key with correct model
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testCorrectModel() {
  try {
    console.log("Testing new Gemini API key with correct model...");
    
    // Initialize with the new API key
    const genAI = new GoogleGenerativeAI("AIzaSyDrYbFe7Bch_lPis7jn0MNU-h1tRmN39gQ");
    
    // Try different model names
    const models = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-001",
      "gemini-pro",
      "gemini-pro-latest"
    ];
    
    for (const modelName of models) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = "Hello, respond with 'API working' if you receive this";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works! Response:`, text);
        console.log(`✅ Found working model: ${modelName}`);
        return;
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Test Error:", error.message);
  }
}

testCorrectModel();
