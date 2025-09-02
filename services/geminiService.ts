import { GoogleGenAI, Type } from "@google/genai";
import type { ImageFile, TarotResult, ParsedDateTime, FortuneResult, SajuResult, Sentiment } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateContentJSONWithRetry = async <T>(
  prompt: string,
  schema: object,
  imagePart?: { inlineData: { data: string; mimeType: string } }
): Promise<T> => {
    try {
        const contents = imagePart ? { parts: [imagePart, { text: prompt }] } : prompt;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Error generating JSON content:", error);
        throw new Error("AI 모델과 통신하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
};


export const getFaceReading = async (image: ImageFile): Promise<FortuneResult> => {
  const prompt = `당신은 수십 년 경력의 관상 전문가입니다. 
  제공된 얼굴 이미지를 분석하여 다음 항목에 대해 상세하고 전문적인 관상 풀이를 한국어로 작성해주세요:
  1.  **전체적인 인상과 기운**: 첫인상에서 느껴지는 성격과 운의 흐름.
  2.  **이마 (초년운)**: 지능, 직업운, 부모운.
  3.  **눈과 눈썹 (중년운)**: 재물운, 명예, 건강, 대인관계.
  4.  **코 (재물운)**: 재물 복과 자존심, 건강 상태.
  5.  **입과 턱 (말년운)**: 의지력, 애정운, 자식운, 노년의 안정성.
  
  분석은 긍정적인 측면과 조심해야 할 점을 균형있게 다루어주세요. 
  결과는 친절하고 이해하기 쉬운 말투로 설명해주세요. 마지막으로, 전체적인 운세 내용의 뉘앙스를 'good', 'neutral', 'bad' 중 하나로 판단해주세요.`;
  const imagePart = {
    inlineData: {
      data: image.base64,
      mimeType: image.mimeType,
    },
  };
  const schema = {
    type: Type.OBJECT,
    properties: {
        content: { type: Type.STRING, description: "상세한 관상 풀이 내용" },
        sentiment: { type: Type.STRING, enum: ['good', 'neutral', 'bad'], description: "결과의 전체적인 뉘앙스" }
    },
    required: ["content", "sentiment"]
  };
  return generateContentJSONWithRetry<FortuneResult>(prompt, schema, imagePart);
};

export const getPalmReading = async (image: ImageFile): Promise<FortuneResult> => {
  const prompt = `당신은 세계적으로 유명한 손금 전문가입니다.
  제공된 손바닥 이미지를 분석하여 주요 3대선(생명선, 두뇌선, 감정선)과 기타 중요한 손금들을 해석해주세요.
  다음 구조에 따라 상세한 손금 풀이를 한국어로 작성해주세요:
  1.  **생명선**: 건강, 수명, 삶의 활력.
  2.  **두뇌선**: 지적 능력, 재능, 적성, 사고 방식.
  3.  **감정선**: 애정운, 결혼운, 성격, 감정 표현 방식.
  4.  **운명선/재물선 (있을 경우)**: 직업운, 사회적 성공, 재물운의 흐름.
  5.  **종합적인 조언**: 손금을 바탕으로 삶을 더 나은 방향으로 이끌기 위한 조언.
  
  해석은 구체적인 예시를 들어 설명하고, 독자가 희망을 가질 수 있도록 긍정적인 관점에서 조언해주세요. 마지막으로, 전체적인 운세 내용의 뉘앙스를 'good', 'neutral', 'bad' 중 하나로 판단해주세요.`;
  const imagePart = {
    inlineData: {
      data: image.base64,
      mimeType: image.mimeType,
    },
  };
  const schema = {
    type: Type.OBJECT,
    properties: {
        content: { type: Type.STRING, description: "상세한 손금 풀이 내용" },
        sentiment: { type: Type.STRING, enum: ['good', 'neutral', 'bad'], description: "결과의 전체적인 뉘앙스" }
    },
    required: ["content", "sentiment"]
  };
  return generateContentJSONWithRetry<FortuneResult>(prompt, schema, imagePart);
};


export const getSajuAndHoroscope = async (birthDate: string, calendarType: 'solar' | 'lunar', birthTime?: string): Promise<SajuResult> => {
    const timeInfo = birthTime ? `태어난 시간은 ${birthTime}입니다.` : "태어난 시간 정보는 없습니다.";
    const calendarInfo = calendarType === 'lunar' ? '음력' : '양력';
    const currentYear = new Date().getFullYear();

    const prompt = `당신은 동양의 사주명리학과 서양의 점성술에 모두 정통한 운세 컨설턴트입니다.
    사용자의 생년월일은 ${calendarInfo} ${birthDate}이고, ${timeInfo}

    먼저, 이 정보를 바탕으로 아래 세 가지 분석을 순서대로 명확하게 구분하여 한국어로 제공해주세요.
    ### 📖 인생 총운 (평생 사주)
    1.  **타고난 기운**: 이 사람의 타고난 오행과 일간(日干)을 분석하고, 이를 바탕으로 한 핵심적인 성격과 기질을 설명해주세요.
    2.  **성격과 재능**: 십신(十神)을 바탕으로 이 사람의 사회적 성향, 대인관계 특징, 숨겨진 재능과 직업적 적성을 심도 있게 분석해주세요.
    3.  **인생의 큰 흐름**: 초년, 중년, 말년으로 이어지는 대운의 전체적인 흐름을 요약하고, 인생에서 특별히 빛을 발할 시기와 조심해야 할 시기에 대해 조언해주세요.
    4.  **평생 조언**: 타고난 사주를 바탕으로 인생을 더욱 풍요롭게 만들기 위한 평생의 지침과 조언을 제시해주세요.

    ### 📜 ${currentYear}년 운세
    (상세 내용 생략)

    ### ✨ 오늘의 운세
    (상세 내용 생략)

    전체적으로 희망적이고 따뜻하며, 독자가 실질적인 도움을 얻을 수 있는 깊이 있는 분석을 제공해주세요.
    
    분석이 끝난 후, 다음 작업을 수행해주세요:
    1. 위에서 분석한 "인생 총운"의 초년, 중년, 말년 운세의 핵심적인 상징과 기운을 각각 요약하여, 이미지 생성 AI가 그림을 그릴 수 있도록 시각적이고 은유적인 프롬프트를 3개 만들어주세요. (예: "초년운: 거친 파도를 헤치고 떠오르는 붉은 태양, 학문과 지혜의 빛을 받으며 항해하는 젊은 학자.")
    2. 전체 운세 내용의 전반적인 뉘앙스를 'good', 'neutral', 'bad' 중 하나로 판단해주세요.`;
    
    const textAndPromptsSchema = {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "전체 사주 및 운세 분석 내용" },
        sentiment: { type: Type.STRING, enum: ['good', 'neutral', 'bad'] },
        imagePrompts: {
          type: Type.OBJECT,
          properties: {
            early: { type: Type.STRING, description: "초년운 이미지 생성 프롬프트" },
            middle: { type: Type.STRING, description: "중년운 이미지 생성 프롬프트" },
            late: { type: Type.STRING, description: "말년운 이미지 생성 프롬프트" }
          },
          required: ["early", "middle", "late"]
        }
      },
      required: ["content", "sentiment", "imagePrompts"]
    };

    const { content, sentiment, imagePrompts } = await generateContentJSONWithRetry<{
      content: string;
      sentiment: Sentiment;
      imagePrompts: { early: string; middle: string; late: string; };
    }>(prompt, textAndPromptsSchema);

    const generateImage = async (imagePrompt: string) => {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `An allegorical and symbolic painting representing a phase of life. Theme: ${imagePrompt}. Ethereal, mystical, detailed, artistic style.`,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
      });
      return response.generatedImages[0].image.imageBytes;
    };

    try {
        const [early, middle, late] = await Promise.all([
            generateImage(imagePrompts.early),
            generateImage(imagePrompts.middle),
            generateImage(imagePrompts.late),
        ]);

        return {
            content,
            sentiment,
            lifeStageImages: { early, middle, late }
        };
    } catch (imageError) {
        console.warn("Could not generate Saju images, returning text only.", imageError);
        return { content, sentiment }; // 이미지를 못만들어도 텍스트는 반환
    }
};

export const parseDateTimeFromSpeech = async (text: string): Promise<ParsedDateTime> => {
    const prompt = `다음 텍스트에서 날짜와 시간을 "YYYY-MM-DD"와 "HH:MM" 형식으로 추출해주세요. 텍스트: "${text}". 시간 정보가 없으면 시간은 빈 문자열로 남겨두세요.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: "YYYY-MM-DD 형식의 날짜" },
            time: { type: Type.STRING, description: "HH:MM 형식의 시간" }
        },
        required: ["date", "time"]
    };
    return generateContentJSONWithRetry<ParsedDateTime>(prompt, schema);
};

export const getTarotReading = async (concern: string, cardName: string): Promise<Omit<TarotResult, 'cardImageBase64'>> => {
    const prompt = `당신은 영적인 타로 마스터입니다. 사용자의 현재 고민은 다음과 같습니다: "${concern}"
    
    사용자가 뽑은 카드는 "${cardName}"입니다.
    
    이 카드와 사용자의 고민을 연결하여 아래 JSON 형식에 맞춰 답변해주세요:
    1.  **cardName**: 뽑힌 카드의 한국어 이름 (예: "${cardName}").
    2.  **interpretation**: 뽑힌 카드에 대한 심층적인 해석. (카드의 상징, 고민과의 연결, 현실적 조언 포함)
    3.  **cardImageDescription**: "${cardName}" 카드의 전통적인 이미지를 상세하게 묘사.
    4.  **sentiment**: 해석 내용의 전반적인 뉘앙스를 'good', 'neutral', 'bad' 중 하나로 판단.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            cardName: { type: Type.STRING },
            interpretation: { type: Type.STRING },
            cardImageDescription: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ['good', 'neutral', 'bad'] }
        },
        required: ["cardName", "interpretation", "cardImageDescription", "sentiment"]
    };
    return generateContentJSONWithRetry<Omit<TarotResult, 'cardImageBase64'>>(prompt, schema);
};

export const getTarotCardImage = async (cardName: string): Promise<string> => {
    try {
        const prompt = `"${cardName}" tarot card. Mystical and artistic style, rich in detail, symbolic imagery. Classic tarot art style.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '9:16',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("이미지를 생성하지 못했습니다.");
        }
    } catch (error) {
        console.error("Error generating tarot card image:", error);
        throw new Error("AI 타로 카드 이미지를 생성하는 중 오류가 발생했습니다.");
    }
};