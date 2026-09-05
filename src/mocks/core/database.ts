import type {
  AcademicYear,
  DemoAttendanceRecord,
  DemoAttendanceSession,
  DemoCenterProfile,
  DemoGradeRecord,
  DemoGroup,
  DemoNotification,
  DemoParentMessage,
  DemoParentProfile,
  DemoStudent,
  DemoTeacher,
  StudentPerformanceBand,
  Subject,
} from "@/mocks/types"
import { average, daysAgo, hoursAgo, percentage, pickFromArray, ratioFromHash } from "@/mocks/core/utils"

const baseDate = new Date("2026-06-04T10:00:00+02:00")

export const demoCenter: DemoCenterProfile = {
  id: "center-nokhba",
  name: "مركز النخبة التعليمي",
  branch: "فرع مدينة نصر",
  city: "القاهرة",
}

const maleFirstNames = [
  "أحمد",
  "محمد",
  "محمود",
  "عبدالله",
  "يوسف",
  "عمر",
  "مصطفى",
  "علي",
  "زياد",
  "كريم",
  "حسن",
  "مروان",
  "أدهم",
  "سيف",
  "إبراهيم",
  "أنس",
]

const femaleFirstNames = [
  "مريم",
  "سلمى",
  "نور",
  "ملك",
  "آية",
  "فاطمة",
  "هنا",
  "جنى",
  "ريم",
  "شهد",
  "يارا",
  "حبيبة",
  "ندى",
  "رنا",
  "تقى",
  "لينا",
]

const middleNames = [
  "محمد",
  "أشرف",
  "حسن",
  "سيد",
  "محمود",
  "عادل",
  "إبراهيم",
  "فتحي",
  "صلاح",
  "عبدالرحمن",
  "مجدي",
  "حلمي",
]

const familyNames = [
  "حسن",
  "السيد",
  "عبدالحميد",
  "الشرقاوي",
  "منصور",
  "فتحي",
  "خليل",
  "حجازي",
  "العشري",
  "سليمان",
  "فاروق",
  "جابر",
  "المصري",
  "صادق",
  "رمضان",
  "ياسين",
]

const fatherNames = [
  "محمد",
  "حسام",
  "خالد",
  "تامر",
  "وائل",
  "إسلام",
  "شريف",
  "طارق",
  "عماد",
  "سامح",
]

const motherNames = [
  "منى",
  "دعاء",
  "عبير",
  "مي",
  "غادة",
  "نهى",
  "سمر",
  "إيمان",
  "جيهان",
  "داليا",
]

const teacherSeed = [
  { id: "teacher-math-1", name: "محمد فاروق", subject: "رياضيات" as const, bio: "متخصص في تأسيس ومراجعات الثانوية العامة." },
  { id: "teacher-math-2", name: "هبة السيد", subject: "رياضيات" as const, bio: "تركز على المتابعة الفردية ورفع الانضباط الدراسي." },
  { id: "teacher-physics-1", name: "سارة أشرف", subject: "فيزياء" as const, bio: "تدير مجموعات الفيزياء المتقدمة والمراجعات المكثفة." },
  { id: "teacher-physics-2", name: "مصطفى حلمي", subject: "فيزياء" as const, bio: "خبرة في التدريب على حل الامتحانات الشهرية." },
  { id: "teacher-chemistry-1", name: "داليا مجدي", subject: "كيمياء" as const, bio: "متابعة دقيقة للواجبات والتحصيل العملي." },
  { id: "teacher-chemistry-2", name: "أحمد سليمان", subject: "كيمياء" as const, bio: "مسؤول عن مجموعات الدعم للصف الثاني الثانوي." },
  { id: "teacher-biology-1", name: "إيمان جابر", subject: "أحياء" as const, bio: "تتابع مجموعات الأحياء للثالث الثانوي والدعم." },
  { id: "teacher-arabic-1", name: "علي رمضان", subject: "لغة عربية" as const, bio: "يشرف على القراءة والتعبير والتحليل النصي." },
  { id: "teacher-arabic-2", name: "ريم منصور", subject: "لغة عربية" as const, bio: "تدعم مجموعات الصفين الأول والثاني." },
  { id: "teacher-english-1", name: "نورهان ياسين", subject: "لغة إنجليزية" as const, bio: "تقود برنامج المحادثة والاختبارات القصيرة." },
  { id: "teacher-english-2", name: "كريم عادل", subject: "لغة إنجليزية" as const, bio: "مسؤول عن مجموعات التأسيس والمستوى المتوسط." },
  { id: "teacher-english-3", name: "مروة حجازي", subject: "لغة إنجليزية" as const, bio: "تتابع مجموعات الدعم الفردي والتحضير النهائي." },
]

const groupSeed = [
  ["group-01", "رياضيات - الصف الثالث الثانوي - مجموعة A", "رياضيات", "الصف الثالث الثانوي", "teacher-math-1", "السبت 6:00 م", "قاعة 1"],
  ["group-02", "رياضيات - الصف الثاني الثانوي - مجموعة B", "رياضيات", "الصف الثاني الثانوي", "teacher-math-2", "الأحد 5:30 م", "قاعة 2"],
  ["group-03", "رياضيات - الصف الأول الثانوي - مجموعة C", "رياضيات", "الصف الأول الثانوي", "teacher-math-2", "الثلاثاء 4:30 م", "قاعة 3"],
  ["group-04", "فيزياء - الصف الثالث الثانوي - مجموعة A", "فيزياء", "الصف الثالث الثانوي", "teacher-physics-1", "الأحد 7:00 م", "قاعة 4"],
  ["group-05", "فيزياء - الصف الثاني الثانوي - مجموعة B", "فيزياء", "الصف الثاني الثانوي", "teacher-physics-2", "الأربعاء 6:00 م", "قاعة 5"],
  ["group-06", "كيمياء - الصف الثالث الثانوي - مجموعة A", "كيمياء", "الصف الثالث الثانوي", "teacher-chemistry-1", "الاثنين 7:30 م", "قاعة 2"],
  ["group-07", "كيمياء - الصف الثاني الثانوي - مجموعة B", "كيمياء", "الصف الثاني الثانوي", "teacher-chemistry-2", "الخميس 5:00 م", "قاعة 1"],
  ["group-08", "أحياء - الصف الثالث الثانوي - مجموعة A", "أحياء", "الصف الثالث الثانوي", "teacher-biology-1", "الثلاثاء 7:00 م", "قاعة 6"],
  ["group-09", "أحياء - الصف الأول الثانوي - مجموعة B", "أحياء", "الصف الأول الثانوي", "teacher-biology-1", "الخميس 4:30 م", "قاعة 6"],
  ["group-10", "لغة عربية - الصف الثالث الثانوي - مجموعة A", "لغة عربية", "الصف الثالث الثانوي", "teacher-arabic-1", "السبت 8:00 م", "قاعة 7"],
  ["group-11", "لغة عربية - الصف الثاني الثانوي - مجموعة B", "لغة عربية", "الصف الثاني الثانوي", "teacher-arabic-2", "الثلاثاء 6:00 م", "قاعة 7"],
  ["group-12", "لغة عربية - الصف الأول الثانوي - مجموعة C", "لغة عربية", "الصف الأول الثانوي", "teacher-arabic-2", "الأربعاء 4:00 م", "قاعة 8"],
  ["group-13", "لغة إنجليزية - الصف الثالث الثانوي - مجموعة A", "لغة إنجليزية", "الصف الثالث الثانوي", "teacher-english-1", "الأحد 8:30 م", "قاعة 3"],
  ["group-14", "لغة إنجليزية - الصف الثاني الثانوي - مجموعة B", "لغة إنجليزية", "الصف الثاني الثانوي", "teacher-english-2", "الاثنين 5:00 م", "قاعة 8"],
  ["group-15", "لغة إنجليزية - الصف الأول الثانوي - مجموعة C", "لغة إنجليزية", "الصف الأول الثانوي", "teacher-english-2", "الخميس 6:00 م", "قاعة 4"],
  ["group-16", "مراجعة فيزياء - الصف الثالث الثانوي - مجموعة مكثفة", "فيزياء", "الصف الثالث الثانوي", "teacher-physics-1", "الجمعة 2:00 م", "قاعة 5"],
  ["group-17", "قدرات رياضيات - الصف الثالث الثانوي - مجموعة مسائية", "رياضيات", "الصف الثالث الثانوي", "teacher-math-1", "الأربعاء 8:00 م", "قاعة 1"],
  ["group-18", "تأسيس لغة إنجليزية - الصف الأول الثانوي - مجموعة دعم", "لغة إنجليزية", "الصف الأول الثانوي", "teacher-english-3", "الجمعة 12:00 م", "قاعة 9"],
] as const

function buildStudentName(index: number, gender: "ذكر" | "أنثى") {
  const firstName = gender === "ذكر" ? maleFirstNames[index % maleFirstNames.length] : femaleFirstNames[index % femaleFirstNames.length]
  const middleName = middleNames[(index * 3) % middleNames.length]
  const familyName = familyNames[(index * 5) % familyNames.length]
  return `${firstName} ${middleName} ${familyName}`
}

function buildParent(index: number, studentId: string) {
  const relation = index % 3 === 0 ? "الأم" : "الأب"
  const firstName = relation === "الأب" ? fatherNames[index % fatherNames.length] : motherNames[index % motherNames.length]
  const familyName = familyNames[(index * 5) % familyNames.length]

  return {
    id: `parent-${index + 1}`,
    name: `${firstName} ${familyName}`,
    phone: `010${String(21000000 + index * 137).padStart(8, "0")}`,
    relation,
    studentId,
  } satisfies DemoParentProfile
}

function getAcademicYear(index: number): AcademicYear {
  if (index < 52) {
    return "الصف الثالث الثانوي"
  }
  if (index < 102) {
    return "الصف الثاني الثانوي"
  }
  return "الصف الأول الثانوي"
}

function getPerformanceBand(index: number): StudentPerformanceBand {
  const remainder = index % 20
  if (remainder < 4) {
    return "excellent"
  }
  if (remainder < 11) {
    return "good"
  }
  if (remainder < 17) {
    return "average"
  }
  return "struggling"
}

function groupIdsForStudent(year: AcademicYear, index: number) {
  if (year === "الصف الثالث الثانوي") {
    const scientificTrack = index % 3
    const scienceGroup = scientificTrack === 0 ? "group-04" : scientificTrack === 1 ? "group-06" : "group-08"
    const optionalGroup = index % 5 === 0 ? "group-17" : index % 7 === 0 ? "group-16" : null
    return ["group-01", "group-10", "group-13", scienceGroup, ...(optionalGroup ? [optionalGroup] : [])]
  }

  if (year === "الصف الثاني الثانوي") {
    const scienceGroup = index % 2 === 0 ? "group-05" : "group-07"
    return ["group-02", "group-11", "group-14", scienceGroup]
  }

  const supportGroup = index % 4 === 0 ? "group-18" : "group-09"
  return ["group-03", "group-12", "group-15", supportGroup]
}

export const teachers: DemoTeacher[] = teacherSeed.map((teacher, index) => ({
  ...teacher,
  phone: `011${String(32000000 + index * 211).padStart(8, "0")}`,
  email: `${teacher.id}@nokhba-demo.local`,
  assignedGroupIds: [],
}))

export const students: DemoStudent[] = Array.from({ length: 148 }, (_, index) => {
  const studentId = `student-${index + 1}`
  const gender = index % 2 === 0 ? "ذكر" : "أنثى"
  const academicYear = getAcademicYear(index)

  return {
    id: studentId,
    name: buildStudentName(index, gender),
    gender,
    academicYear,
    performanceBand: getPerformanceBand(index),
    parentId: `parent-${index + 1}`,
    enrolledGroupIds: groupIdsForStudent(academicYear, index),
    notes:
      getPerformanceBand(index) === "struggling"
        ? "يحتاج إلى متابعة أسبوعية مع ولي الأمر وتحسين الانتظام في الواجبات."
        : getPerformanceBand(index) === "excellent"
          ? "ملتزم بالحضور ويظهر تقدماً ثابتاً في الاختبارات القصيرة."
          : "أداؤه مستقر ويستفيد من المتابعة المستمرة مع المعلم.",
  }
})

export const parents: DemoParentProfile[] = students.map((student, index) =>
  buildParent(index, student.id)
)

export const groups: DemoGroup[] = groupSeed.map(
  ([id, name, subject, academicYear, teacherId, scheduleLabel, room]) => ({
    id,
    name,
    subject: subject as Subject,
    academicYear: academicYear as AcademicYear,
    teacherId,
    scheduleLabel,
    room,
    capacity: 24,
    studentIds: students
      .filter((student) => student.enrolledGroupIds.includes(id))
      .map((student) => student.id),
  })
)

teachers.forEach((teacher) => {
  teacher.assignedGroupIds = groups
    .filter((group) => group.teacherId === teacher.id)
    .map((group) => group.id)
})

export const attendanceSessions: DemoAttendanceSession[] = groups.flatMap((group) =>
  Array.from({ length: 8 }, (_, weekIndex) => {
    const date = daysAgo(baseDate, 3 + weekIndex * 4 + (groups.findIndex((item) => item.id === group.id) % 3), 18)

    return {
      id: `${group.id}-session-${weekIndex + 1}`,
      groupId: group.id,
      teacherId: group.teacherId,
      date,
      submittedAt: hoursAgo(new Date(date), -2),
    }
  })
)

function attendanceStatusForStudent(student: DemoStudent, sessionId: string) {
  const ratio = ratioFromHash(`${student.id}-${sessionId}`)

  if (student.performanceBand === "excellent") {
    if (ratio > 0.97) return "absent"
    if (ratio > 0.9) return "late"
    return "present"
  }

  if (student.performanceBand === "good") {
    if (ratio > 0.92) return "absent"
    if (ratio > 0.84) return "late"
    return "present"
  }

  if (student.performanceBand === "average") {
    if (ratio > 0.87) return "absent"
    if (ratio > 0.78) return "late"
    return "present"
  }

  if (ratio > 0.8) return "absent"
  if (ratio > 0.68) return "late"
  return "present"
}

export const attendanceRecords: DemoAttendanceRecord[] = attendanceSessions.flatMap((session) => {
  const group = groups.find((item) => item.id === session.groupId)!

  return group.studentIds.map((studentId) => {
    const student = students.find((item) => item.id === studentId)!
    const status = attendanceStatusForStudent(student, session.id)

    return {
      id: `${session.id}-${studentId}`,
      sessionId: session.id,
      groupId: group.id,
      studentId,
      teacherId: group.teacherId,
      date: session.date,
      status,
    }
  })
})

const assessmentTemplates = [
  { type: "quiz", title: "كويز الوحدة الأولى", maxScore: 20, daysOffset: 20 },
  { type: "monthly", title: "اختبار شهري مايو", maxScore: 30, daysOffset: 12 },
  { type: "final", title: "اختبار شامل نهاية الدورة", maxScore: 50, daysOffset: 3 },
] as const

function percentageForBand(band: StudentPerformanceBand, seed: string) {
  const ratio = ratioFromHash(seed)

  if (band === "excellent") return 88 + Math.round(ratio * 10)
  if (band === "good") return 74 + Math.round(ratio * 12)
  if (band === "average") return 61 + Math.round(ratio * 14)
  return 45 + Math.round(ratio * 18)
}

export const gradeRecords: DemoGradeRecord[] = groups.flatMap((group) =>
  assessmentTemplates.flatMap((assessment) =>
    group.studentIds.map((studentId) => {
      const student = students.find((item) => item.id === studentId)!
      const normalizedPercentage = Math.min(
        99,
        percentageForBand(student.performanceBand, `${group.id}-${assessment.title}-${studentId}`)
      )
      const score = Math.round((normalizedPercentage / 100) * assessment.maxScore)
      const percentageValue = percentage((score / assessment.maxScore) * 100)

      return {
        id: `${group.id}-${assessment.type}-${studentId}`,
        groupId: group.id,
        studentId,
        teacherId: group.teacherId,
        subject: group.subject,
        assessmentType: assessment.type,
        assessmentTitle: assessment.title,
        maxScore: assessment.maxScore,
        score,
        percentage: percentageValue,
        date: daysAgo(baseDate, assessment.daysOffset + (groups.findIndex((item) => item.id === group.id) % 4), 20),
      }
    })
  )
)

const absenceCandidates = students
  .map((student) => {
    const absences = attendanceRecords.filter(
      (record) => record.studentId === student.id && record.status === "absent"
    ).length

    return { student, absences }
  })
  .sort((left, right) => right.absences - left.absences)

const lowGradeCandidates = students
  .map((student) => {
    const values = gradeRecords
      .filter((record) => record.studentId === student.id)
      .map((record) => record.percentage)
    return { student, average: average(values) }
  })
  .sort((left, right) => left.average - right.average)

export const parentMessages: DemoParentMessage[] = Array.from({ length: 30 }, (_, index) => {
  const student = pickFromArray(
    index % 2 === 0 ? absenceCandidates.map((item) => item.student) : lowGradeCandidates.map((item) => item.student),
    `message-${index}`
  )
  const parent = parents.find((item) => item.studentId === student.id)!
  const category = (["absence", "performance", "appreciation", "follow_up"] as const)[index % 4]

  const subject =
    category === "absence"
      ? `استفسار بخصوص غياب ${student.name.split(" ")[0]}`
      : category === "performance"
        ? `مراجعة مستوى ${student.name.split(" ")[0]} في ${groups.find((group) => group.id === student.enrolledGroupIds[0])?.subject ?? "المادة"}`
        : category === "appreciation"
          ? `شكر لإدارة المركز على متابعة ${student.name.split(" ")[0]}`
          : `طلب متابعة إضافية للطالب ${student.name.split(" ")[0]}`

  const body =
    category === "absence"
      ? "نرجو توضيح أسباب الغياب المتكرر هذا الأسبوع والتأكد من إرسال الواجبات المنزلية."
      : category === "performance"
        ? "لاحظنا تراجعاً بسيطاً في آخر اختبار ونرغب في معرفة أفضل خطة للمراجعة قبل الامتحان القادم."
        : category === "appreciation"
          ? "نشكر المعلم وإدارة المركز على المتابعة المستمرة والتحسن الملحوظ في مستوى الطالب."
          : "نحتاج إلى جلسة متابعة قصيرة بعد الحصة القادمة لمناقشة خطة التحسين والانتظام."

  return {
    id: `message-${index + 1}`,
    studentId: student.id,
    parentId: parent.id,
    category,
    subject,
    body,
    createdAt: hoursAgo(baseDate, 6 + index * 5),
    direction: index % 5 === 0 ? "outgoing" : "incoming",
  }
})

export const notifications: DemoNotification[] = [
  ...absenceCandidates.slice(0, 8).map(({ student, absences }, index) => ({
    id: `notification-warning-${index + 1}`,
    type: "warning" as const,
    title: `غياب متكرر للطالب ${student.name}`,
    description: `سجل الطالب ${absences} حالات غياب خلال آخر الأسابيع ويحتاج إلى متابعة مباشرة مع ولي الأمر.`,
    createdAt: hoursAgo(baseDate, 2 + index * 4),
    studentId: student.id,
    groupId: student.enrolledGroupIds[0],
  })),
  ...teachers.slice(0, 6).map((teacher, index) => ({
    id: `notification-success-${index + 1}`,
    type: "success" as const,
    title: `رفع درجات مجموعة ${groups.find((group) => group.teacherId === teacher.id)?.subject ?? teacher.subject}`,
    description: `قام ${teacher.name} برفع نتائج آخر اختبار ومراجعة التقييمات الخاصة بالمجموعة.`,
    createdAt: hoursAgo(baseDate, 5 + index * 6),
    teacherId: teacher.id,
    groupId: teacher.assignedGroupIds[0],
  })),
  ...parentMessages.slice(0, 6).map((message, index) => ({
    id: `notification-info-${index + 1}`,
    type: "info" as const,
    title: `تمت قراءة تقرير الطالب ${students.find((student) => student.id === message.studentId)?.name ?? ""}`,
    description: `اطلع ولي الأمر على التقرير الأخير وتم تسجيل ملاحظة ضمن سجل المتابعة.`,
    createdAt: hoursAgo(baseDate, 7 + index * 8),
    studentId: message.studentId,
  })),
]

export const database = {
  center: demoCenter,
  students,
  parents,
  teachers,
  groups,
  attendanceSessions,
  attendanceRecords,
  gradeRecords,
  parentMessages,
  notifications,
}

