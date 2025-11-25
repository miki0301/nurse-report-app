import React, { useState, useEffect, useMemo } from 'react';
import { Copy, FileText, Activity, Stethoscope, Coffee, BookOpen, RefreshCw, CheckCircle2, Settings, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

/**
 * DEFAULT DATA CONSTANTS (Initial data only, state will override)
 */

const DEFAULT_JOB_TYPES = [
  "行政/文書作業",
  "客服/門市/銷售作業",
  "生產/加工作業",
  "組裝/包裝作業",
  "倉儲/物流/搬運作業",
  "機械維修/保養作業",
  "清潔/環境維護作業",
  "化學品相關作業",
  "外勤/工程/施工作業",
  "餐飲烹調/食品處理作業",
  "專業/教學/技術服務類作業",
  "寵物美容作業",
  "其他"
];

const DEFAULT_SHIFTS = ["日班", "中班", "夜班", "輪班", "其他"];
const DEFAULT_WORKING_HOURS = ["8小時", "12小時", "其他"];
const DEFAULT_HEALTH_GRADES = ["一級", "二級", "三級", "四級"];
const DEFAULT_ABNORMAL_VALUES = ["腰圍", "血壓", "血糖", "總膽固醇", "三酸甘油酯", "高密度脂蛋白", "低密度脂蛋白", "肝功能(GOT/GPT)", "腎功能(Cre/eGFR)", "尿酸", "BMI異常", "聽力異常", "其他"];

const DEFAULT_MEDICATION_STATUS = [
  "無",
  "成藥",
  "慢性病藥物（規則服用）",
  "慢性病藥物（不規則服用）",
  "精神科／助眠",
  "保健食品",
  "其他"
];

const DEFAULT_SLEEP_STATUS = [
  "正常（充足且規律）",
  "尚可（睡眠略不足或偶有中斷）",
  "難入睡（失眠、入睡困難）",
  "常熬夜（晚睡、睡眠不足）"
];

const DEFAULT_DIET_HABITS = [
  "三餐規律",
  "飲食不規律",
  "外食為主",
  "少蔬果",
  "高油脂飲食",
  "高糖飲食",
  "高鹽飲食",
  "吃太快",
  "食量少／食慾差",
  "宵夜習慣",
  "零食／甜食"
];

const DEFAULT_EXERCISE_HABITS = [
  "無運動習慣",
  "偶爾運動（不規律）",
  "規律運動（每週≧2~3）",
  "強度運動（每週≧3~5次，中高強度）",
  "特殊或職業性體力活動",
  "活動量不足"
];

const DEFAULT_HEALTH_EDU_DB = {
  "血糖管理": [
    "飲食規律與三餐固定：維持三餐規律，避免跳餐或忽餓忽飽。",
    "主食選擇與份量控管：選擇全穀雜糧替代精製澱粉，一餐約「拳頭大小」。",
    "蔬菜攝取量增加：每天至少攝取 3–5 份蔬菜，延緩醣類吸收。",
    "避免含糖飲料與手搖飲：建議以白開水或無糖茶取代。",
    "水果攝取時機與份量：每日 1 份為原則，建議於飯後 1 小時食用。",
    "外食三減原則：減油、減鹽、減糖，避免喝湯喝到底。",
    "每日身體活動目標：增加活動量，促進血糖代謝。"
  ],
  "血壓管理": [
    "每日監測血壓（722原則）：連續7天量測，早晚各2次，取平均值。",
    "減鹽飲食（DASH飲食）：多吃蔬果、全穀類，減少醃漬品與醬料。",
    "控制體重：維持BMI在18.5-24之間，減少心臟負擔。",
    "規律有氧運動：每週至少150分鐘中等強度運動。",
    "戒菸與限制酒精：吸菸會使血管收縮，酒精過量升高血壓。",
    "情緒與壓力管理：適度放鬆，避免情緒波動過大。"
  ],
  "血脂管理（膽固醇、TG）": [
    "減少飽和脂肪攝取：少吃紅肉、奶油、棕櫚油。",
    "避免反式脂肪：少吃油炸物、酥皮點心、奶精。",
    "增加膳食纖維：多吃燕麥、豆類、蔬果，幫助代謝膽固醇。",
    "限制精緻糖類：過多果糖與砂糖會轉化為三酸甘油酯。",
    "補充Omega-3脂肪酸：適量攝取深海魚類或魚油。"
  ],
  "肝功能管理": [
    "避免酒精攝取：酒精直接造成肝臟負擔與損傷。",
    "不亂服成藥或偏方：避免不明來源草藥或止痛藥過量。",
    "充足睡眠不熬夜：晚間11點至凌晨3點為肝臟修復黃金期。",
    "定期追蹤檢查：每3-6個月追蹤GOT/GPT及腹部超音波。"
  ],
  "肥胖 / BMI / 減重管理": [
    "熱量赤字：每日減少攝取300-500大卡。",
    "細嚼慢嚥：每口咀嚼20下，增加飽足感訊號。",
    "餐前喝水：餐前30分鐘喝水500cc，減少進食量。",
    "增加肌肉量：搭配阻力訓練，提升基礎代謝率。"
  ],
  "工作安全與職務調整": [
    "個人防護裝備使用：佩戴安全帽、手套、護目鏡及口罩。",
    "正確搬運姿勢：屈膝挺背，避免彎腰或扭轉身體。",
    "工作間歇休息：每工作 1–2 小時建議短暫休息或伸展。",
    "安全操作機具：檢查安全裝置與操作規範。",
    "正確姿勢坐姿：保持腰背挺直、雙腳平放。",
    "高處作業安全：使用安全帶及護欄。",
    "消防與緊急演練：熟悉逃生路線與程序。"
  ],
  "其他": []
};

// Helper to persist state to localStorage
const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.warn("LocalStorage load error", e);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }, [key, state]);

  return [state, setState];
};

/**
 * MAIN COMPONENT
 */
export default function OccupationalHealthApp() {
  // --- SETTINGS / CONFIGURATION STATE ---
  const [view, setView] = useState("report"); // 'report' or 'settings'
  
  // Persisted Option Lists
  const [jobTypes, setJobTypes] = usePersistedState("jobTypes", DEFAULT_JOB_TYPES);
  const [shifts, setShifts] = usePersistedState("shifts", DEFAULT_SHIFTS);
  const [workingHours, setWorkingHours] = usePersistedState("workingHours", DEFAULT_WORKING_HOURS);
  const [healthGrades, setHealthGrades] = usePersistedState("healthGrades", DEFAULT_HEALTH_GRADES);
  const [abnormalValuesList, setAbnormalValuesList] = usePersistedState("abnormalValues", DEFAULT_ABNORMAL_VALUES);
  const [medicationStatusList, setMedicationStatusList] = usePersistedState("medicationStatus", DEFAULT_MEDICATION_STATUS);
  const [sleepStatusList, setSleepStatusList] = usePersistedState("sleepStatus", DEFAULT_SLEEP_STATUS);
  const [dietHabitsList, setDietHabitsList] = usePersistedState("dietHabits", DEFAULT_DIET_HABITS);
  const [exerciseHabitsList, setExerciseHabitsList] = usePersistedState("exerciseHabits", DEFAULT_EXERCISE_HABITS);
  const [healthEduDb, setHealthEduDb] = usePersistedState("healthEduDb", DEFAULT_HEALTH_EDU_DB);

  // --- REPORT FORM STATE ---
  
  // Section 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    gender: "男",
    age: "",
    jobType: "",
    shift: "",
    hours: "",
    grade: "",
    abnormalValues: [],
  });

  // Initialize dropdowns with first item if empty
  useEffect(() => {
    setBasicInfo(prev => ({
      ...prev,
      jobType: prev.jobType || jobTypes[0],
      shift: prev.shift || shifts[0],
      hours: prev.hours || workingHours[0],
      grade: prev.grade || healthGrades[1],
    }));
  }, [jobTypes, shifts, workingHours, healthGrades]);

  // Section 2: Physiological
  const [physio, setPhysio] = useState({
    bpSys: "",
    bpDia: "",
    bpStage: "", 
    homeBpSys: "",
    homeBpDia: "",
    hasMonitor: "有",
    medStatus: "", 
  });

  useEffect(() => {
      if(!physio.medStatus && medicationStatusList.length > 0) {
          setPhysio(p => ({...p, medStatus: medicationStatusList[2]})); // Default to Chronic Regular
      }
  }, [medicationStatusList]);

  // Section 3: Lifestyle
  const [lifestyle, setLifestyle] = useState({
    smoking: "無吸菸習慣",
    drinking: "無飲酒習慣",
    exercise: "",
    diet: "",
    carbPref: "",
    sleepHours: "6-7",
    sleepStatus: "",
    waterVol: "1500",
    drinkType: "白開水",
  });

  useEffect(() => {
      setLifestyle(prev => ({
          ...prev,
          exercise: prev.exercise || exerciseHabitsList[0],
          diet: prev.diet || dietHabitsList[0],
          sleepStatus: prev.sleepStatus || sleepStatusList[0]
      }));
  }, [exerciseHabitsList, dietHabitsList, sleepStatusList]);


  // Section 4: Education (Recommendations)
  const [eduCategory, setEduCategory] = useState("");
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [customRecommendation, setCustomRecommendation] = useState("");

  // Initialize category
  useEffect(() => {
      if (!eduCategory && Object.keys(healthEduDb).length > 0) {
          setEduCategory(Object.keys(healthEduDb)[0]);
      }
  }, [healthEduDb]);

  // --- HANDLERS ---

  const handleBasicChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAbnormalToggle = (value) => {
    setBasicInfo(prev => {
      const exists = prev.abnormalValues.includes(value);
      if (exists) return { ...prev, abnormalValues: prev.abnormalValues.filter(v => v !== value) };
      return { ...prev, abnormalValues: [...prev.abnormalValues, value] };
    });
  };

  const handlePhysioChange = (field, value) => {
    setPhysio(prev => ({ ...prev, [field]: value }));
  };

  // Auto-calculate BP Stage
  useEffect(() => {
    const sys = parseInt(physio.bpSys);
    const dia = parseInt(physio.bpDia);
    if (!sys || !dia) {
        setPhysio(prev => ({ ...prev, bpStage: "" }));
        return;
    }

    let stage = "正常";
    if (sys >= 160 || dia >= 100) stage = "二";
    else if (sys >= 140 || dia >= 90) stage = "一";
    else if (sys >= 130 || dia >= 80) stage = "高血壓前期";

    setPhysio(prev => ({ ...prev, bpStage: stage }));
  }, [physio.bpSys, physio.bpDia]);

  const handleLifestyleChange = (field, value) => {
    setLifestyle(prev => ({ ...prev, [field]: value }));
  };

  const addRecommendation = (rec) => {
    if (!selectedRecommendations.includes(rec)) {
      setSelectedRecommendations([...selectedRecommendations, rec]);
    }
  };

  const removeRecommendation = (rec) => {
    setSelectedRecommendations(selectedRecommendations.filter(r => r !== rec));
  };

  const addCustomRec = () => {
    if (customRecommendation.trim()) {
      addRecommendation(customRecommendation.trim());
      setCustomRecommendation("");
    }
  };

  // --- REPORT GENERATION LOGIC ---

  const generateReport = () => {
    // Paragraph 1
    const abnormalStr = basicInfo.abnormalValues.length > 0 ? basicInfo.abnormalValues.join("、") : "無明顯";
    const para1 = `${basicInfo.name || "OOO"}，${basicInfo.gender}性，${basicInfo.age || "O"}歲，負責${basicInfo.jobType}，${basicInfo.shift}，工時${basicInfo.hours}，114年健檢健康管理分級${basicInfo.grade}，因${abnormalStr}異常，安排諮詢關懷：`;

    // Paragraph 2
    const bpText = physio.bpStage 
      ? `今日血壓量測持續偏高，已達第${physio.bpStage}期高血壓範圍，` 
      : "今日血壓量測數值如上，";
    
    const homeBpText = (physio.homeBpSys && physio.homeBpDia) 
      ? `${physio.homeBpSys}/${physio.homeBpDia}` 
      : "未測量";

    const para2 = `${bpText}個案主述於家中測量血壓約為 ${homeBpText} mmHg，家中${physio.hasMonitor}血壓計可自行監測。目前藥物使用情況${physio.medStatus}，114年健檢報告顯示異常數值均高於正常值`;

    // Paragraph 3
    const carbText = lifestyle.carbPref ? `，特別偏好${lifestyle.carbPref}類食物` : "";
    
    const para3 = `生活型態部分，個案目前${lifestyle.smoking}、${lifestyle.drinking}。運動方面${lifestyle.exercise}。飲食方面${lifestyle.diet}，飲食中碳水化合物比例偏高${carbText}。睡眠時間每日約 ${lifestyle.sleepHours} 小時，${lifestyle.sleepStatus}。飲水量約 ${lifestyle.waterVol}cc／日，平時以${lifestyle.drinkType}為主要飲品。`;

    // Paragraph 4
    const recsList = selectedRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n");
    const para4 = `建議如下：\n${recsList || "(尚未選擇衛教建議)"}`;

    return `${para1}\n\n${para2}\n\n${para3}\n\n${para4}`;
  };

  const reportContent = useMemo(generateReport, [basicInfo, physio, lifestyle, selectedRecommendations]);

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = reportContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert("報告已複製到剪貼簿！");
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const clearAll = () => {
    if(confirm("確定要重置表單嗎？(管理選項不會被刪除)")) {
       setBasicInfo({ name: "", gender: "男", age: "", jobType: jobTypes[0], shift: shifts[0], hours: workingHours[0], grade: healthGrades[1], abnormalValues: [] });
       setPhysio({ bpSys: "", bpDia: "", bpStage: "", homeBpSys: "", homeBpDia: "", hasMonitor: "有", medStatus: medicationStatusList[2] });
       setLifestyle({ smoking: "無吸菸習慣", drinking: "無飲酒習慣", exercise: exerciseHabitsList[0], diet: dietHabitsList[0], carbPref: "", sleepHours: "6-7", sleepStatus: sleepStatusList[0], waterVol: "1500", drinkType: "白開水" });
       setSelectedRecommendations([]);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <h1 className="text-xl font-bold">勞工健康服務護理師 - 報告生成器</h1>
          </div>
          <div className="flex gap-2">
            {view === 'report' ? (
                <>
                    <button onClick={clearAll} className="text-sm bg-emerald-700 hover:bg-emerald-800 px-3 py-1 rounded flex items-center gap-1 transition">
                        <RefreshCw className="h-3 w-3" /> 重置表單
                    </button>
                    <button onClick={() => setView('settings')} className="text-sm bg-slate-700 hover:bg-slate-800 px-3 py-1 rounded flex items-center gap-1 transition">
                        <Settings className="h-3 w-3" /> 選項管理
                    </button>
                </>
            ) : (
                <button onClick={() => setView('report')} className="text-sm bg-slate-700 hover:bg-slate-800 px-3 py-1 rounded flex items-center gap-1 transition">
                    <ArrowLeft className="h-3 w-3" /> 返回報告生成
                </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4">
        
        {view === 'settings' ? (
            <SettingsManager 
                jobTypes={jobTypes} setJobTypes={setJobTypes}
                shifts={shifts} setShifts={setShifts}
                workingHours={workingHours} setWorkingHours={setWorkingHours}
                healthGrades={healthGrades} setHealthGrades={setHealthGrades}
                abnormalValuesList={abnormalValuesList} setAbnormalValuesList={setAbnormalValuesList}
                medicationStatusList={medicationStatusList} setMedicationStatusList={setMedicationStatusList}
                sleepStatusList={sleepStatusList} setSleepStatusList={setSleepStatusList}
                dietHabitsList={dietHabitsList} setDietHabitsList={setDietHabitsList}
                exerciseHabitsList={exerciseHabitsList} setExerciseHabitsList={setExerciseHabitsList}
                healthEduDb={healthEduDb} setHealthEduDb={setHealthEduDb}
            />
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COLUMN: INPUT FORM */}
                <div className="space-y-6 overflow-y-auto h-[calc(100vh-100px)] pr-2 pb-20 custom-scrollbar">
                
                    {/* Section 1: Basic Info */}
                    <section className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                        <BookOpen className="h-5 w-5" /> 個案基本資料
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">姓名</label>
                            <input type="text" value={basicInfo.name} onChange={(e) => handleBasicChange("name", e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="輸入姓名" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">年齡</label>
                            <input type="number" value={basicInfo.age} onChange={(e) => handleBasicChange("age", e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="輸入年齡" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">性別</label>
                            <select value={basicInfo.gender} onChange={(e) => handleBasicChange("gender", e.target.value)} className="w-full p-2 border rounded bg-white">
                            <option value="男">男</option>
                            <option value="女">女</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">健康管理分級</label>
                            <select value={basicInfo.grade} onChange={(e) => handleBasicChange("grade", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {healthGrades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">職務類型</label>
                            <select value={basicInfo.jobType} onChange={(e) => handleBasicChange("jobType", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">工作班別</label>
                            <select value={basicInfo.shift} onChange={(e) => handleBasicChange("shift", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">工時</label>
                            <select value={basicInfo.hours} onChange={(e) => handleBasicChange("hours", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {workingHours.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-2">異常數值 (可複選)</label>
                            <div className="flex flex-wrap gap-2">
                            {abnormalValuesList.map(val => (
                                <button
                                key={val}
                                onClick={() => handleAbnormalToggle(val)}
                                className={`px-3 py-1 rounded-full text-sm border transition ${
                                    basicInfo.abnormalValues.includes(val) 
                                    ? "bg-red-100 border-red-300 text-red-700 font-medium" 
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                                >
                                {val}
                                </button>
                            ))}
                            </div>
                        </div>
                        </div>
                    </section>

                    {/* Section 2: Physio & Meds */}
                    <section className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                        <Stethoscope className="h-5 w-5" /> 生理數據與用藥
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-md">
                            <div className="col-span-2 text-sm font-semibold text-slate-700">今日血壓 (mmHg)</div>
                            <input type="number" placeholder="收縮壓" value={physio.bpSys} onChange={(e) => handlePhysioChange("bpSys", e.target.value)} className="w-full p-2 border rounded outline-none focus:ring-1 focus:ring-emerald-400" />
                            <input type="number" placeholder="舒張壓" value={physio.bpDia} onChange={(e) => handlePhysioChange("bpDia", e.target.value)} className="w-full p-2 border rounded outline-none focus:ring-1 focus:ring-emerald-400" />
                            <div className="col-span-2 text-xs text-slate-500 text-right">自動判定分期: {physio.bpStage ? `第${physio.bpStage}期` : "待輸入"}</div>
                        </div>

                        <div className="col-span-2 grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-md">
                            <div className="col-span-2 text-sm font-semibold text-slate-700">家中量測主述 (mmHg)</div>
                            <input type="number" placeholder="家中收縮壓" value={physio.homeBpSys} onChange={(e) => handlePhysioChange("homeBpSys", e.target.value)} className="w-full p-2 border rounded outline-none focus:ring-1 focus:ring-blue-400" />
                            <input type="number" placeholder="家中舒張壓" value={physio.homeBpDia} onChange={(e) => handlePhysioChange("homeBpDia", e.target.value)} className="w-full p-2 border rounded outline-none focus:ring-1 focus:ring-blue-400" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">家中是否有血壓計</label>
                            <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="monitor" value="有" checked={physio.hasMonitor === "有"} onChange={() => handlePhysioChange("hasMonitor", "有")} className="text-emerald-600" /> 有
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="monitor" value="無" checked={physio.hasMonitor === "無"} onChange={() => handlePhysioChange("hasMonitor", "無")} className="text-emerald-600" /> 無
                            </label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">藥物使用情況 (點選代入)</label>
                            <select value={physio.medStatus} onChange={(e) => handlePhysioChange("medStatus", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {medicationStatusList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        </div>
                    </section>

                    {/* Section 3: Lifestyle */}
                    <section className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                        <Coffee className="h-5 w-5" /> 生活型態
                        </h2>
                        <div className="space-y-4">
                        {/* Habits */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">吸菸習慣</label>
                            <select value={lifestyle.smoking} onChange={(e) => handleLifestyleChange("smoking", e.target.value)} className="w-full p-2 border rounded bg-white">
                                <option value="無吸菸習慣">無吸菸習慣</option>
                                <option value="有吸菸習慣">有吸菸習慣</option>
                                <option value="已戒除">已戒除</option>
                            </select>
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">飲酒習慣</label>
                            <select value={lifestyle.drinking} onChange={(e) => handleLifestyleChange("drinking", e.target.value)} className="w-full p-2 border rounded bg-white">
                                <option value="無飲酒習慣">無飲酒習慣</option>
                                <option value="有飲酒習慣">有飲酒習慣</option>
                                <option value="偶爾小酌">偶爾小酌</option>
                                <option value="已戒除">已戒除</option>
                            </select>
                            </div>
                        </div>

                        {/* Exercise */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">運動習慣</label>
                            <select value={lifestyle.exercise} onChange={(e) => handleLifestyleChange("exercise", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {exerciseHabitsList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                            </select>
                        </div>

                        {/* Diet */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-600">飲食習慣</label>
                            <select value={lifestyle.diet} onChange={(e) => handleLifestyleChange("diet", e.target.value)} className="w-full p-2 border rounded bg-white">
                            {dietHabitsList.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input 
                            type="text" 
                            placeholder="特別偏好哪類碳水化合物? (如: 麵包、白飯、甜點)" 
                            value={lifestyle.carbPref}
                            onChange={(e) => handleLifestyleChange("carbPref", e.target.value)}
                            className="w-full p-2 border rounded text-sm bg-slate-50"
                            />
                        </div>

                        {/* Sleep */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-600 mb-1">睡眠時數 (hr)</label>
                            <input type="text" value={lifestyle.sleepHours} onChange={(e) => handleLifestyleChange("sleepHours", e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                            <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">睡眠狀況</label>
                            <select value={lifestyle.sleepStatus} onChange={(e) => handleLifestyleChange("sleepStatus", e.target.value)} className="w-full p-2 border rounded bg-white">
                                {sleepStatusList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            </div>
                        </div>

                        {/* Water */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">飲水量 (cc/日)</label>
                            <input type="number" value={lifestyle.waterVol} onChange={(e) => handleLifestyleChange("waterVol", e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">主要飲品</label>
                            <input type="text" value={lifestyle.drinkType} onChange={(e) => handleLifestyleChange("drinkType", e.target.value)} className="w-full p-2 border rounded" placeholder="如: 無糖茶" />
                            </div>
                        </div>
                        </div>
                    </section>

                    {/* Section 4: Education */}
                    <section className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">
                        <FileText className="h-5 w-5" /> 衛教建議選擇
                        </h2>
                        <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">選擇衛教分類</label>
                            <select value={eduCategory} onChange={(e) => setEduCategory(e.target.value)} className="w-full p-2 border rounded bg-white font-medium">
                            {Object.keys(healthEduDb).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="bg-slate-50 p-3 rounded border h-48 overflow-y-auto">
                            <p className="text-xs text-slate-500 mb-2">點選下方項目加入報告：</p>
                            <div className="space-y-2">
                            {healthEduDb[eduCategory]?.map((item, idx) => {
                                const isSelected = selectedRecommendations.includes(item);
                                return (
                                <div 
                                    key={idx} 
                                    onClick={() => isSelected ? removeRecommendation(item) : addRecommendation(item)}
                                    className={`p-2 rounded cursor-pointer text-sm flex items-start gap-2 transition ${
                                    isSelected ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-white hover:bg-slate-100 border border-slate-100"
                                    }`}
                                >
                                    <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-300"}`} />
                                    <span>{item}</span>
                                </div>
                                );
                            })}
                            {(healthEduDb[eduCategory]?.length === 0) && <div className="text-slate-400 text-center italic py-4">此分類無預設項目</div>}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input 
                            type="text" 
                            value={customRecommendation} 
                            onChange={(e) => setCustomRecommendation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomRec()}
                            className="flex-1 p-2 border rounded text-sm" 
                            placeholder="自訂衛教建議..." 
                            />
                            <button onClick={addCustomRec} className="bg-slate-600 text-white px-3 py-1 rounded hover:bg-slate-700">新增</button>
                        </div>

                        {selectedRecommendations.length > 0 && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">已選項目 ({selectedRecommendations.length})</label>
                                <div className="flex flex-wrap gap-2">
                                {selectedRecommendations.map((rec, i) => (
                                    <div key={i} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                                        <span className="truncate max-w-[200px]">{rec}</span>
                                        <button onClick={() => removeRecommendation(rec)} className="hover:text-emerald-900 font-bold">×</button>
                                    </div>
                                ))}
                                <button onClick={() => setSelectedRecommendations([])} className="text-xs text-slate-400 hover:text-red-500 underline self-center">清除全部</button>
                                </div>
                            </div>
                        )}
                        </div>
                    </section>

                </div>

                {/* RIGHT COLUMN: PREVIEW */}
                <div className="flex flex-col h-[calc(100vh-100px)]">
                    <div className="bg-white rounded-lg shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
                        <div className="bg-slate-100 p-3 border-b flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">報告預覽</h3>
                            <button 
                            onClick={copyToClipboard} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow-sm transition"
                            >
                            <Copy className="h-4 w-4" /> 複製報告
                            </button>
                        </div>
                        <textarea 
                            readOnly
                            className="flex-1 w-full p-6 font-mono text-sm leading-relaxed text-slate-800 bg-white resize-none outline-none"
                            value={reportContent}
                        />
                        <div className="bg-slate-50 p-2 text-xs text-slate-400 text-center border-t">
                            內容僅供參考，請依實際專業評估調整。
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

/**
 * SETTINGS SUB-COMPONENT
 * Manages lists and dictionaries (Health Edu)
 */
function SettingsManager({
    jobTypes, setJobTypes,
    shifts, setShifts,
    workingHours, setWorkingHours,
    healthGrades, setHealthGrades,
    abnormalValuesList, setAbnormalValuesList,
    medicationStatusList, setMedicationStatusList,
    sleepStatusList, setSleepStatusList,
    dietHabitsList, setDietHabitsList,
    exerciseHabitsList, setExerciseHabitsList,
    healthEduDb, setHealthEduDb
}) {
    const [activeTab, setActiveTab] = useState("basic"); // basic | healthEdu

    return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 h-full flex flex-col">
            <div className="border-b p-4 flex gap-4">
                <button 
                    onClick={() => setActiveTab("basic")}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'basic' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    基本選項管理
                </button>
                <button 
                    onClick={() => setActiveTab("healthEdu")}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'healthEdu' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    衛教資料庫管理
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {activeTab === "basic" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SimpleListEditor title="職務類型" list={jobTypes} setList={setJobTypes} />
                        <SimpleListEditor title="工作班別" list={shifts} setList={setShifts} />
                        <SimpleListEditor title="工時" list={workingHours} setList={setWorkingHours} />
                        <SimpleListEditor title="健康分級" list={healthGrades} setList={setHealthGrades} />
                        <SimpleListEditor title="異常數值" list={abnormalValuesList} setList={setAbnormalValuesList} />
                        <SimpleListEditor title="藥物使用情況" list={medicationStatusList} setList={setMedicationStatusList} />
                        <SimpleListEditor title="睡眠狀況" list={sleepStatusList} setList={setSleepStatusList} />
                        <SimpleListEditor title="飲食習慣" list={dietHabitsList} setList={setDietHabitsList} />
                        <SimpleListEditor title="運動習慣" list={exerciseHabitsList} setList={setExerciseHabitsList} />
                    </div>
                )}

                {activeTab === "healthEdu" && (
                    <HealthEduEditor db={healthEduDb} setDb={setHealthEduDb} />
                )}
            </div>
        </div>
    );
}

// Editor for simple string arrays
function SimpleListEditor({ title, list, setList }) {
    const [newItem, setNewItem] = useState("");

    const add = () => {
        if (newItem.trim()) {
            setList([...list, newItem.trim()]);
            setNewItem("");
        }
    };

    const remove = (index) => {
        if(confirm(`確定要刪除「${list[index]}」嗎？`)) {
            const newList = [...list];
            newList.splice(index, 1);
            setList(newList);
        }
    };

    return (
        <div className="bg-slate-50 p-4 rounded border">
            <h3 className="font-semibold text-slate-700 mb-3">{title}</h3>
            <div className="flex gap-2 mb-3">
                <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && add()}
                    className="flex-1 p-1.5 text-sm border rounded"
                    placeholder="新增項目"
                />
                <button onClick={add} className="bg-emerald-600 text-white p-1.5 rounded hover:bg-emerald-700"><Plus className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {list.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-slate-100 group">
                        <span>{item}</span>
                        <button onClick={() => remove(idx)} className="text-slate-300 hover:text-red-500 group-hover:text-slate-400"><Trash2 className="h-3 w-3" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Editor for Health Edu Dictionary
function HealthEduEditor({ db, setDb }) {
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(db)[0] || "");
    const [newCategory, setNewCategory] = useState("");
    const [newItem, setNewItem] = useState("");

    const addCategory = () => {
        if(newCategory.trim() && !db[newCategory.trim()]) {
            setDb({ ...db, [newCategory.trim()]: [] });
            setSelectedCategory(newCategory.trim());
            setNewCategory("");
        }
    };

    const deleteCategory = () => {
        if(confirm(`確定要刪除整個分類「${selectedCategory}」及其內容嗎？`)) {
            const newDb = { ...db };
            delete newDb[selectedCategory];
            setDb(newDb);
            setSelectedCategory(Object.keys(newDb)[0] || "");
        }
    };

    const addItem = () => {
        if(newItem.trim() && selectedCategory) {
            setDb({
                ...db,
                [selectedCategory]: [...db[selectedCategory], newItem.trim()]
            });
            setNewItem("");
        }
    };

    const removeItem = (index) => {
        if(confirm("確定刪除此建議項目？")) {
            const newItems = [...db[selectedCategory]];
            newItems.splice(index, 1);
            setDb({
                ...db,
                [selectedCategory]: newItems
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            {/* Categories List */}
            <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded border flex flex-col">
                <h3 className="font-semibold text-slate-700 mb-3">衛教分類</h3>
                <div className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 p-1.5 text-sm border rounded"
                        placeholder="新增分類名稱"
                    />
                    <button onClick={addCategory} className="bg-emerald-600 text-white p-1.5 rounded hover:bg-emerald-700"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                    {Object.keys(db).map(cat => (
                        <div 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`p-2 rounded cursor-pointer text-sm flex justify-between items-center ${selectedCategory === cat ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-white hover:bg-slate-100 border border-slate-100'}`}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
                {selectedCategory && (
                     <button onClick={deleteCategory} className="mt-4 text-xs text-red-500 hover:text-red-700 hover:underline text-left">刪除目前分類: {selectedCategory}</button>
                )}
            </div>

            {/* Items List */}
            <div className="w-full md:w-2/3 bg-slate-50 p-4 rounded border flex flex-col">
                <h3 className="font-semibold text-slate-700 mb-3">
                    {selectedCategory ? `「${selectedCategory}」的建議內容` : "請先選擇分類"}
                </h3>
                
                {selectedCategory ? (
                    <>
                        <div className="flex gap-2 mb-3">
                            <textarea 
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addItem())}
                                className="flex-1 p-2 text-sm border rounded resize-none h-20"
                                placeholder="輸入衛教內容..."
                            />
                            <button onClick={addItem} className="bg-emerald-600 text-white px-4 rounded hover:bg-emerald-700 h-20 flex items-center justify-center">新增</button>
                        </div>
                        <ul className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {db[selectedCategory]?.map((item, idx) => (
                                <li key={idx} className="flex gap-2 items-start text-sm bg-white p-3 rounded border border-slate-100 group">
                                    <span className="bg-slate-100 text-slate-500 px-1.5 rounded text-xs mt-0.5">{idx + 1}</span>
                                    <span className="flex-1 leading-relaxed">{item}</span>
                                    <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 group-hover:text-slate-400"><Trash2 className="h-4 w-4" /></button>
                                </li>
                            ))}
                            {db[selectedCategory]?.length === 0 && <p className="text-slate-400 text-sm text-center py-10">此分類尚無內容</p>}
                        </ul>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        請從左側選擇一個分類來編輯內容
                    </div>
                )}
            </div>
        </div>
    );
}
