const axios = require('axios');
const User = require('../models/User');

const generateRoutine = async (req, res) => {
  const { prompt } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const systemPrompt = `
당신은 사용자에게 운동 루틴을 추천하는 트레이너입니다.

사용자의 신체 정보:
- 키: ${user.height || "알 수 없음"}cm
- 몸무게: ${user.weight || "알 수 없음"}kg
- 성별: ${user.gender || "알 수 없음"}
- 생년월일: ${user.birthdate ? user.birthdate.toISOString().split("T")[0] : "알 수 없음"}

사용자의 요청: ${prompt}

운동 루틴 생성 기준:
- 사용자의 문장이 완벽하지 않거나 자유로운 말투여도 운동 관련 키워드(예: "상체", "덤벨", "루틴", "운동", "시간" 등)가 포함되어 있다면 최대한 의도를 파악해 운동 루틴을 생성하세요.
- 운동과 정말 무관한 경우(예: 날씨 질문, 정치 얘기 등)에만 다음 메시지를 JSON 형식으로 반환하세요.

\`\`\`json
{ "message": "운동 루틴과 관련된 내용을 입력해주세요." }
\`\`\`

반환 형식 예시:
\`\`\`json
[
  { "name": "푸쉬업", "sets": 3, "reps": 15 },
  { "name": "덤벨 컬", "sets": 4, "reps": 12 }
]
\`\`\`

설명 없이 오직 JSON 데이터만 반환하세요.
`;

    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: systemPrompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const raw = openaiRes.data.choices[0].message.content;
    const matched = raw.match(/\{.*\}|\[.*\]/s);

    if (!matched) {
      return res.status(400).json({ message: "운동 루틴 형식을 인식하지 못했습니다." });
    }

    const parsed = JSON.parse(matched[0]);

    if (Array.isArray(parsed)) {
      return res.status(200).json(parsed); // ✅ 배열 그대로 반환
    } else {
      return res.status(400).json({ message: parsed.message || "운동 루틴이 아닙니다." });
    }

  } catch (error) {
    console.error("GPT 호출 실패:", error.response?.data || error.message);
    res.status(500).json({ message: "요청 중 오류 발생" });
  }
};

module.exports = { generateRoutine };
