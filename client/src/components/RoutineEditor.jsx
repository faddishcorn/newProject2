import { memo } from "react";
import { Plus, Save, X } from "lucide-react";
import { toast } from "react-toastify";

// 루틴 편집 컴포넌트 (AI 생성 루틴과 새 루틴 생성에서 공통으로 사용)
const RoutineEditor = memo(function RoutineEditor({
  routine,
  isNew = false,
  onChangeTitle,
  onChangeExercise,
  onAddExercise,
  onRemoveExercise,
  onCancel,
  onSave,
}) {
  const handleSave = () => {
    // 저장하기 전에 입력값 검증
    for (const exercise of routine.exercises) {
      if (!routine.title.trim()) {
        toast.error("루틴 이름을 입력하세요.");
        return;
      }
      if (!exercise.name.trim()) {
        toast.error("운동 이름을 입력하세요.");
        return;
      }
      if (!exercise.sets || exercise.sets < 1) {
        toast.error("세트 수는 1 이상이어야 합니다.");
        return;
      }
      if (!exercise.reps || exercise.reps < 1) {
        toast.error("반복 횟수는 1 이상이어야 합니다.");
        return;
      }
    }

    // 검증 통과하면 저장 실행
    onSave(routine);
  };

  if (!routine) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <label
          htmlFor="routine-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          루틴 이름
        </label>
        <input
          id="routine-title"
          type="text"
          value={routine.title}
          onChange={(e) => onChangeTitle(e, isNew)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">운동 목록</h3>
          <button
            onClick={() => onAddExercise(isNew)}
            className="flex items-center text-sm px-2 py-1 rounded-md"
            style={{ color: "#6ca7af" }}
          >
            <Plus size={16} className="mr-1" />
            운동 추가
          </button>
        </div>

        <div className="space-y-4">
          {routine.exercises.map((exercise) => (
            <div
              key={exercise.id || exercise._id}
              className="p-4 border rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    운동명
                  </label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      onChangeExercise(
                        exercise.id || exercise._id,
                        "name",
                        e.target.value,
                        isNew,
                      )
                    }
                    className="font-medium text-gray-800 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
                    required
                  />
                </div>
                <button
                  onClick={() =>
                    onRemoveExercise(exercise.id || exercise._id, isNew)
                  }
                  className="p-1 rounded-full hover:bg-gray-100 text-red-500 ml-2"
                  title="운동 삭제"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    세트
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exercise.sets === 0 ? "" : exercise.sets}
                    onChange={(e) =>
                      onChangeExercise(
                        exercise.id || exercise._id,
                        "sets",
                        e.target.value === "" ? "" : Number(e.target.value),
                        isNew,
                      )
                    }
                    required
                    className="w-full px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    반복 횟수
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exercise.reps === 0 ? "" : exercise.reps}
                    onChange={(e) =>
                      onChangeExercise(
                        exercise.id || exercise._id,
                        "reps",
                        e.target.value === "" ? "" : Number(e.target.value),
                        isNew,
                      )
                    }
                    required
                    className="w-full px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}

          {routine.exercises.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>운동이 없습니다. 운동을 추가해보세요!</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors"
          style={{ backgroundColor: "#6ca7af" }}
        >
          <Save size={18} className="mr-2" />
          루틴 저장하기
        </button>
      </div>
    </div>
  );
});

export default RoutineEditor;
