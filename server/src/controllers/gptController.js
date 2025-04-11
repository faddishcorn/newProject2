const axios = require('axios');

const generateRoutine = async (req, res) => {
  const { prompt, height, weight, gender, birth } = req.body;

  try {
    const systemPrompt = `
당신은 사용자에게 운동 루틴을 추천하는 트레이너입니다.
사용자의 신체 정보:
- 키: ${height}cm
- 몸무게: ${weight}kg
- 성별: ${gender}
- 생년월일: ${birth}

요청 내용: ${prompt}

다음 형식으로 배열 형태로만 응답하세요 (설명 없이 JSON만 반환):
\`\`\`json
[
  { "name": "운동이름", "sets": 3, "reps": 12 },
  ...
]
\`\`\`
`;

    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: systemPrompt
          },
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
    const routine = JSON.parse(raw.match(/\[.*\]/s)[0]); // JSON만 추출

    res.status(200).json({ routine });
  } catch (error) {
    console.error("GPT 호출 실패:", error.response?.data || error.message);
    res.status(500).json({ message: "GPT 요청 중 오류 발생" });
  }
};

module.exports = { generateRoutine };