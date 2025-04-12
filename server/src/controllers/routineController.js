const UserRoutine = require('../models/UserRoutine');

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
      exercises
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
      userId: req.user.id
    });
    if (!routine) return res.status(404).json({ message: "루틴을 찾을 수 없습니다" });
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
      { new: true }
    );
    if (!routine) return res.status(404).json({ message: "루틴을 찾을 수 없습니다" });
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: "루틴 수정 실패" });
  }
};

module.exports = {
  getMyRoutines,
  createRoutine,
  deleteRoutine,
  updateRoutine
};