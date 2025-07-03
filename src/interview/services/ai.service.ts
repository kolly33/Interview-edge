import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAIApi;

  constructor(private configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateSuggestions(
    transcript: string, 
    context: { 
      sessionType: string,
      previousResponses?: string[],
      resumeData?: any
    }
  ): Promise<any> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an interview assistant helping with ${context.sessionType} interviews. 
                     Consider the following context and provide appropriate suggestions.`
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return {
        suggestions: response.data.choices[0].message?.content,
        confidence: response.data.choices[0].finish_reason === 'stop' ? 1 : 0.5
      };
    } catch (error) {
      throw new Error(`AI suggestion generation failed: ${error.message}`);
    }
  }
}
