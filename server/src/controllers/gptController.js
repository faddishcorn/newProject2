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

요청 내용: ${prompt}

다음 형식으로 배열 형태로만 응답하세요 (설명 없이 JSON만 반환):
\`\`\`json
[
  { "name": "운동이름", "sets": 3, "reps": 12 },
  ...
]
\`\`\`

만약 운동 및 운동루틴과 완전히 관련 없는 요청이라면 (개인적 상황 등 어느정도의 타 주제 및 내용은 루틴생성에 반영해야 합니다.):
\`\`\`json
{ "message": "운동 루틴과 관련된 내용을 입력해주세요." }
\`\`\`
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
