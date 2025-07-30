export const runtime = 'edge';

export async function POST() {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: "Create exactly three open-ended and engaging questions for an anonymous social messaging platform. Return ONLY the three questions, each separated by '||'. Do not include any explanations, introductions, or additional text. Just the questions in this exact format: 'Question 1||Question 2||Question 3'. The questions should be suitable for a diverse audience and encourage friendly interaction."
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Groq API response:', data);
    
    let suggestions: string;
    const content = data.choices[0].message.content.trim();
    console.log('Raw content:', content);
    
    // Try to format the response for the AI library
    if (content.includes('||')) {
      suggestions = content;
    } else {
      // If no || separator, try to parse as individual lines and join with ||
      const lines = content.split('\n').filter((line: string) => line.trim() && line.includes('?'));
      if (lines.length >= 3) {
        suggestions = lines.slice(0, 3)
          .map((line: string) => line.trim().replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, ''))
          .join('||');
      } else {
        // Use fallback suggestions
        suggestions = "What's the best advice you've ever received?||If you could learn any skill instantly, what would it be?||What's a small thing that always makes you smile?";
      }
    }

    // Return a streaming response compatible with the AI library
    return new Response(suggestions, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    
    // Fallback suggestions if API fails
    const fallbackSuggestions = "What's the best advice you've ever received?||If you could learn any skill instantly, what would it be?||What's a small thing that always makes you smile?";

    return new Response(fallbackSuggestions, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
