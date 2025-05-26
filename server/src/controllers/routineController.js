const UserRoutine = require("../models/UserRoutine");
const DailyRoutine = require("../models/Routine");

const getMyRoutines = async (req, res) => {
  try {
    const routines = await UserRoutine.find({ userId: req.user.id });
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: "루틴 목록 조회 실패" });
  }
};

const createRoutine = async (req, res) => {
  try {
    const { title, exercises } = req.body;
    const routine = new UserRoutine({
      userId: req.user.id,
      title,
      exercises,
    });
    await routine.save();
    res.status(201).json(routine);
  } catch (err) {
    res.status(500).json({ message: "루틴 저장 실패" });
  }
};

const deleteRoutine = async (req, res) => {
  try {
    const routine = await UserRoutine.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!routine)
      return res.status(404).json({ message: "루틴을 찾을 수 없습니다" });
    res.json({ message: "루틴이 삭제되었습니다" });
  } catch (err) {
    res.status(500).json({ message: "루틴 삭제 실패" });
  }
};

const updateRoutine = async (req, res) => {
  try {
    const { title, exercises } = req.body;
    const routine = await UserRoutine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, exercises },
      { new: true },
    );
    if (!routine)
      return res.status(404).json({ message: "루틴을 찾을 수 없습니다" });
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: "루틴 수정 실패" });
  }
};

const saveRoutineHistory = async (req, res) => {
  const userId = req.user.id;
  const { title, exercises } = req.body;

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000) // UTC+9
  .toISOString()
  .split("T")[0];

  try {
    let record = await DailyRoutine.findOne({ userId, date: today });

    const newRoutine = { title, exercises };

    if (record) {
      record.routines.push(newRoutine);
      await record.save();
    } else {
      await DailyRoutine.create({
        userId,
        date: today,
        routines: [newRoutine],
      });
    }

    res.status(200).json({ message: "루틴 기록 저장 완료" });
  } catch (error) {
    console.error("기록 저장 실패:", error);
    res.status(500).json({ message: "루틴 기록 저장 중 오류 발생" });
  }
};

module.exports = {
  getMyRoutines,
  createRoutine,
  deleteRoutine,
  updateRoutine,
  saveRoutineHistory,
};
