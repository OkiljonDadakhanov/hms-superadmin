import type {
  Patient,
  Doctor,
  Appointment,
  Message,
  MedicineProduct,
  EducationContent,
  ActivityOverview,
  TopMedicine,
  PatientFee,
} from "@/types"

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Elizabeth Polson",
    age: 32,
    gender: "Female",
    bloodGroup: "B+ve",
    phoneNumber: "+91 12345 67890",
    email: "elizabethpolson@hotmail.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "p2",
    name: "John David",
    age: 28,
    gender: "Male",
    bloodGroup: "B+ve",
    phoneNumber: "+91 12345 67890",
    email: "davidjohn22@gmail.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "p3",
    name: "Krishtov Rajan",
    age: 24,
    gender: "Male",
    bloodGroup: "AB+ve",
    phoneNumber: "+91 12345 67890",
    email: "krishtovrajan2@gmail.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "p4",
    name: "Sumanth Tirson",
    age: 26,
    gender: "Male",
    bloodGroup: "O+ve",
    phoneNumber: "+91 12345 67890",
    email: "tirtim@gmail.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "p5",
    name: "Ed Subramani",
    age: 77,
    gender: "Male",
    bloodGroup: "AB+ve",
    phoneNumber: "+91 12345 67890",
    email: "egs3122@gmail.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "p6",
    name: "Ranjan Maari",
    age: 77,
    gender: "Male",
    bloodGroup: "O+ve",
    phoneNumber: "+91 12345 67890",
    email: "ranjanmaari@yahoo.com",
    avatar: "/placeholder.svg",
  },
  {
    id: "p7",
    name: "Philipie Gopal",
    age: 55,
    gender: "Male",
    bloodGroup: "O-ve",
    phoneNumber: "+91 12345 67890",
    email: "gopal22@gmail.com",
    avatar: "/placeholder.svg",
  },
]

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. John Paulliston",
    specialization: "Cardiologist",
    qualification: "Doctor's degree in medicine (MBBS)",
    phoneNumber: "+91 12345 67890",
    floorRoom: "1/219",
    dayOff: "Sun - Wed & Govt. Holiday",
    gender: "Male",
    age: 45,
    avatar: "/placeholder.svg",
  },
  {
    id: "d2",
    name: "Dr. Joel Paulliston",
    specialization: "Neurologist",
    qualification: "Surgery (MBBS)",
    phoneNumber: "+91 12345 67890",
    floorRoom: "2/76",
    dayOff: "Fri & Govt. Holiday",
    gender: "Male",
    age: 38,
    avatar: "/placeholder.svg",
  },
  {
    id: "d3",
    name: "Dr. Sarah",
    specialization: "Pediatrician",
    qualification: "BPT (Bachelor of Physiotherapy)",
    phoneNumber: "+91 12345 67890",
    floorRoom: "3/43",
    dayOff: "Tue - Thurs & Govt. Holiday",
    gender: "Female",
    age: 35,
    avatar: "/placeholder.svg",
  },
  {
    id: "d4",
    name: "Dr. Michael",
    specialization: "Orthopedic",
    qualification: "BPT (Bachelor of Physiotherapy)",
    phoneNumber: "+91 12345 67890",
    floorRoom: "5/24",
    dayOff: "Mon & Govt. Holiday",
    gender: "Male",
    age: 42,
    avatar: "/placeholder.svg",
  },
]

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "d1",
    time: "9:30 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Paid",
  },
  {
    id: "a2",
    patientId: "p2",
    doctorId: "d2",
    time: "9:30 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Unpaid",
  },
  {
    id: "a3",
    patientId: "p3",
    doctorId: "d2",
    time: "10:30 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Paid",
  },
  {
    id: "a4",
    patientId: "p4",
    doctorId: "d1",
    time: "11:00 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Unpaid",
  },
  {
    id: "a5",
    patientId: "p5",
    doctorId: "d1",
    time: "11:30 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Unpaid",
  },
  {
    id: "a6",
    patientId: "p6",
    doctorId: "d1",
    time: "11:00 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Unpaid",
  },
  {
    id: "a7",
    patientId: "p7",
    doctorId: "d1",
    time: "11:00 AM",
    date: "05/12/2022",
    status: "Scheduled",
    feeStatus: "Paid",
  },
]

// Add the messages array
export const messages: Message[] = [
  {
    id: "m1",
    senderId: "p1",
    receiverId: "d2",
    content: "Hi I need to meet Dr. Joel tomorrow urgently. Please arrange appointment.",
    timestamp: "11:27pm",
    read: true,
  },
  {
    id: "m2",
    senderId: "d2",
    receiverId: "p1",
    content: "I will Confirm with Doctor and then inform you.",
    timestamp: "11:29pm",
    read: true,
  },
  {
    id: "m3",
    senderId: "p1",
    receiverId: "admin",
    content: "Hi I need to meet Dr. Joel tomorrow urgently. Please arrange appointment.",
    timestamp: "Today",
    read: true,
  },
  {
    id: "m4",
    senderId: "admin",
    receiverId: "p1",
    content:
      "Unfortunately, all of his appointments for tomorrow are fully booked. We do have a cancellation list, and sometimes patients cancel their appointments at the last minute. If you would like, I can put you on the cancellation list and call you if a slot becomes available.",
    timestamp: "11:30am",
    read: true,
  },
  {
    id: "m5",
    senderId: "p1",
    receiverId: "admin",
    content:
      "Could you please check if there are any other available times for an appointment as this is an Emergency situation.",
    timestamp: "11:34am",
    read: true,
  },
  {
    id: "m6",
    senderId: "admin",
    receiverId: "p1",
    content: "Dr. Joel has agreed to see you tomorrow at 9:00 am due to the urgency of your situation.",
    timestamp: "11:42am",
    read: true,
  },
  {
    id: "m7",
    senderId: "p1",
    receiverId: "admin",
    content:
      "Thank you for scheduling my appointment. I confirm that I will be present tomorrow at the designated time.",
    timestamp: "11:52am",
    read: true,
  },
  {
    id: "m8",
    senderId: "p2",
    receiverId: "admin",
    content: "Hello, I need to reschedule my appointment for next week.",
    timestamp: "10:15am",
    read: false,
  },
  {
    id: "m9",
    senderId: "d1",
    receiverId: "admin",
    content: "Please inform all my patients that I'll be on leave next Monday.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "m10",
    senderId: "p3",
    receiverId: "admin",
    content: "Can you send me the lab results from my last visit?",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "m11",
    senderId: "admin",
    receiverId: "p3",
    content: "I've attached your lab results. Please let me know if you have any questions.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "m12",
    senderId: "p4",
    receiverId: "admin",
    content: "I'm experiencing severe headaches. Should I come in for an emergency appointment?",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: "m13",
    senderId: "admin",
    receiverId: "p4",
    content: "Yes, please come in immediately. I've scheduled an emergency appointment with Dr. Michael at 2 PM today.",
    timestamp: "3 days ago",
    read: true,
  },
]

export const medicineProducts: MedicineProduct[] = [
  {
    id: "med1",
    name: "Albuterol (salbutamol)",
    type: "Inhaler",
    price: 28.55,
    stock: 100,
    unit: "pcs",
    expiryDate: "01 Jun 2024",
    manufacturer: "John's Health Care",
    category: "RESPIRATORY",
  },
  {
    id: "med2",
    name: "Amoxicillin 250 mg",
    type: "Tablet",
    price: 40.55,
    stock: 28,
    unit: "pcs",
    expiryDate: "21 Jul 2023",
    manufacturer: "Patheon Pvt Ltd",
    category: "ANTIBIOTICS",
  },
  {
    id: "med3",
    name: "Aspirin 300 mg",
    type: "Tablet",
    price: 28.55,
    stock: 150,
    unit: "pcs",
    expiryDate: "01 Jun 2024",
    manufacturer: "David's Ltd",
    category: "ANALGESICS",
  },
  {
    id: "med4",
    name: "Benadryl 500 ml",
    type: "Syrup",
    price: 77.55,
    stock: 80,
    unit: "ml",
    expiryDate: "28 Apr 2025",
    manufacturer: "Johnson & Johnson",
    category: "RESPIRATORY",
  },
  {
    id: "med5",
    name: "Butenafine 100 g",
    type: "Cream",
    price: 70.55,
    stock: 100,
    unit: "pcs",
    expiryDate: "01 Jun 2024",
    manufacturer: "Michel's Lab",
    category: "DERMATOLOGY",
  },
  {
    id: "med6",
    name: "Cefixime 100 mg",
    type: "Capsule",
    price: 28.55,
    stock: 100,
    unit: "pcs",
    expiryDate: "01 Jun 2024",
    manufacturer: "David's Ltd",
    category: "ANTIBIOTICS",
  },
  {
    id: "med7",
    name: "KZ Soap 250g",
    type: "Soap",
    price: 250.55,
    stock: 55,
    unit: "pcs",
    expiryDate: "01 Feb 2024",
    manufacturer: "John's Health Care",
    category: "DERMATOLOGY",
  },
  {
    id: "med8",
    name: "Paracetamol 250mg",
    type: "Tablet",
    price: 28.55,
    stock: 200,
    unit: "pcs",
    expiryDate: "08 Sep 2024",
    manufacturer: "Joe Industries",
    category: "ANALGESICS",
  },
]

export const educationContents: EducationContent[] = [
  {
    id: "ec1",
    title: "4 Nutritions to Take Daily",
    description: "Essential nutrients everyone should include in their daily diet for optimal health.",
    author: "Dr. Lisa Peterson",
    thumbnail: "/placeholder.svg",
    content: `
    <h1>Essential Daily Nutrients</h1>
    <p>Maintaining a balanced diet is crucial for overall health. Here are four essential nutrients you should consume daily:</p>
    
    <h2>1. Vitamin D</h2>
    <p>Vitamin D is essential for bone health and immune function. Sources include:</p>
    <ul>
      <li>Sunlight exposure</li>
      <li>Fatty fish (salmon, mackerel)</li>
      <li>Fortified foods (milk, orange juice)</li>
      <li>Egg yolks</li>
    </ul>
    
    <h2>2. Omega-3 Fatty Acids</h2>
    <p>These essential fats support heart and brain health. Find them in:</p>
    <ul>
      <li>Fatty fish (salmon, sardines)</li>
      <li>Flaxseeds and chia seeds</li>
      <li>Walnuts</li>
      <li>Algae and seaweed</li>
    </ul>
    
    <h2>3. Fiber</h2>
    <p>Dietary fiber supports digestive health and helps maintain healthy cholesterol levels. Good sources include:</p>
    <ul>
      <li>Whole grains</li>
      <li>Fruits and vegetables</li>
      <li>Legumes</li>
      <li>Nuts and seeds</li>
    </ul>
    
    <h2>4. Protein</h2>
    <p>Protein is essential for tissue repair and immune function. Sources include:</p>
    <ul>
      <li>Lean meats</li>
      <li>Fish and seafood</li>
      <li>Eggs</li>
      <li>Dairy products</li>
      <li>Legumes and tofu</li>
    </ul>
    
    <p>Remember to consult with your healthcare provider before making significant changes to your diet.</p>
  `,
    category: "Nutrition",
    createdAt: "2023-01-15",
    assignedTo: ["p1", "p3"],
  },
  {
    id: "ec2",
    title: "5 Healthy Lifestyle Tips",
    description: "Simple lifestyle changes that can significantly improve your overall health and wellbeing.",
    author: "Dr. John Morrison",
    thumbnail: "/placeholder.svg",
    content: `
    <h1>5 Healthy Lifestyle Tips</h1>
    <p>Making small changes to your daily routine can have a significant impact on your health. Here are five tips to help you live a healthier life:</p>
    
    <h2>1. Prioritize Sleep</h2>
    <p>Aim for 7-9 hours of quality sleep each night. Good sleep hygiene practices include:</p>
    <ul>
      <li>Maintaining a consistent sleep schedule</li>
      <li>Creating a restful environment</li>
      <li>Limiting screen time before bed</li>
      <li>Avoiding caffeine and large meals before bedtime</li>
    </ul>
    
    <h2>2. Stay Hydrated</h2>
    <p>Proper hydration is essential for nearly every bodily function. Tips for staying hydrated:</p>
    <ul>
      <li>Carry a reusable water bottle</li>
      <li>Set reminders to drink water throughout the day</li>
      <li>Eat water-rich fruits and vegetables</li>
      <li>Limit alcohol and caffeine consumption</li>
    </ul>
    
    <h2>3. Move Regularly</h2>
    <p>Regular physical activity is crucial for physical and mental health. Aim to:</p>
    <ul>
      <li>Get at least 150 minutes of moderate exercise weekly</li>
      <li>Incorporate strength training twice a week</li>
      <li>Take short walking breaks throughout the day</li>
      <li>Find activities you enjoy to make exercise sustainable</li>
    </ul>
    
    <h2>4. Practice Mindfulness</h2>
    <p>Mindfulness can help reduce stress and improve mental wellbeing. Try:</p>
    <ul>
      <li>Daily meditation (even just 5-10 minutes)</li>
      <li>Deep breathing exercises</li>
      <li>Mindful eating</li>
      <li>Regular technology breaks</li>
    </ul>
    
    <h2>5. Maintain Social Connections</h2>
    <p>Strong social connections contribute to better health outcomes. Make time to:</p>
    <ul>
      <li>Connect with friends and family regularly</li>
      <li>Join community groups or classes</li>
      <li>Volunteer for causes you care about</li>
      <li>Practice active listening in your relationships</li>
    </ul>
    
    <p>Remember that small, consistent changes are more sustainable than dramatic lifestyle overhauls.</p>
  `,
    category: "Lifestyle",
    createdAt: "2023-02-20",
    assignedTo: ["p2", "p4"],
  },
  {
    id: "ec3",
    title: "Do's and Don'ts in Hospital",
    description: "Important guidelines to follow when visiting or staying in a hospital environment.",
    author: "Dr. Jeff Peterson",
    thumbnail: "/placeholder.svg",
    content: `
    <h1>Hospital Do's and Don'ts</h1>
    <p>Whether you're a patient or visitor, following these guidelines helps ensure a safe and comfortable hospital experience for everyone.</p>
    
    <h2>Do's</h2>
    <ul>
      <li><strong>Follow staff instructions:</strong> Healthcare professionals provide guidance for your safety and wellbeing.</li>
      <li><strong>Practice good hygiene:</strong> Wash hands frequently and use hand sanitizer when entering and leaving rooms.</li>
      <li><strong>Respect quiet hours:</strong> Hospitals designate quiet times to allow patients to rest and recover.</li>
      <li><strong>Inform staff of allergies and medications:</strong> Always keep your healthcare team updated about your medical history.</li>
      <li><strong>Bring essential personal items:</strong> Items like eyeglasses, hearing aids, and comfortable clothing can make your stay more comfortable.</li>
      <li><strong>Ask questions:</strong> Don't hesitate to seek clarification about your care or treatment plan.</li>
    </ul>
    
    <h2>Don'ts</h2>
    <ul>
      <li><strong>Don't visit if you're sick:</strong> To protect vulnerable patients, avoid visiting if you have cold, flu, or other contagious symptoms.</li>
      <li><strong>Don't bring strong-smelling foods or flowers:</strong> These can trigger allergies or nausea in some patients.</li>
      <li><strong>Don't use mobile phones in restricted areas:</strong> Some equipment can be affected by cell phone signals.</li>
      <li><strong>Don't smoke:</strong> Hospitals are smoke-free environments.</li>
      <li><strong>Don't exceed visitor limits:</strong> Respect guidelines about the number of visitors allowed at one time.</li>
      <li><strong>Don't take photos or videos without permission:</strong> Respect the privacy of other patients and staff.</li>
    </ul>
    
    <h2>For Patients</h2>
    <ul>
      <li>Bring a list of current medications and dosages</li>
      <li>Designate a trusted person to communicate with your healthcare team</li>
      <li>Bring comfortable, loose-fitting clothing for your stay</li>
      <li>Leave valuables at home when possible</li>
    </ul>
    
    <h2>For Visitors</h2>
    <ul>
      <li>Check visiting hours before arriving</li>
      <li>Keep visits brief if the patient tires easily</li>
      <li>Offer to bring essential items the patient may need</li>
      <li>Be mindful of noise levels</li>
    </ul>
    
    <p>Following these guidelines helps create a healing environment for all patients.</p>
  `,
    category: "Patient Education",
    createdAt: "2023-03-10",
    assignedTo: ["p5"],
  },
  {
    id: "ec4",
    title: "Healthy Habits to Follow",
    description: "Simple daily habits that can lead to better health outcomes and improved quality of life.",
    author: "Dr. Emily Rodriguez",
    thumbnail: "/placeholder.svg",
    content: `
    <h1>Healthy Habits for Better Living</h1>
    <p>Incorporating these healthy habits into your daily routine can lead to significant improvements in your physical and mental wellbeing.</p>
    
    <h2>Morning Habits</h2>
    <ul>
      <li><strong>Hydrate first thing:</strong> Drink a glass of water upon waking to rehydrate after sleep.</li>
      <li><strong>Eat a nutritious breakfast:</strong> Include protein, healthy fats, and complex carbohydrates.</li>
      <li><strong>Practice mindfulness:</strong> Spend 5-10 minutes meditating or setting intentions for the day.</li>
      <li><strong>Move your body:</strong> Even a short morning stretch or walk can energize you for the day ahead.</li>
    </ul>
    
    <h2>Daytime Habits</h2>
    <ul>
      <li><strong>Take movement breaks:</strong> Stand up and stretch every hour if you have a sedentary job.</li>
      <li><strong>Practice proper posture:</strong> Be mindful of how you sit and stand throughout the day.</li>
      <li><strong>Stay hydrated:</strong> Drink water consistently throughout the day.</li>
      <li><strong>Eat mindfully:</strong> Focus on your food during meals and avoid eating at your desk or in front of screens.</li>
      <li><strong>Take short mental breaks:</strong> Practice deep breathing or brief meditation during stressful moments.</li>
    </ul>
    
    <h2>Evening Habits</h2>
    <ul>
      <li><strong>Limit screen time:</strong> Reduce exposure to blue light at least an hour before bedtime.</li>
      <li><strong>Create a bedtime routine:</strong> Signal to your body that it's time to wind down with consistent pre-sleep activities.</li>
      <li><strong>Reflect on the day:</strong> Practice gratitude by noting positive moments from your day.</li>
      <li><strong>Prepare for tomorrow:</strong> Reduce morning stress by preparing what you need for the next day.</li>
    </ul>
    
    <h2>Weekly Habits</h2>
    <ul>
      <li><strong>Meal preparation:</strong> Set aside time to plan and prepare healthy meals for the week.</li>
      <li><strong>Digital detox:</strong> Take a break from social media and screens for at least a few hours each week.</li>
      <li><strong>Connect with loved ones:</strong> Nurture your relationships through quality time with family and friends.</li>
      <li><strong>Engage in a hobby:</strong> Make time for activities that bring you joy and relaxation.</li>
    </ul>
    
    <p>Remember that forming new habits takes time. Start with one or two changes and gradually incorporate more as these become routine.</p>
  `,
    category: "Lifestyle",
    createdAt: "2023-04-05",
    assignedTo: ["p6", "p7"],
  },
]

export const activityOverview: ActivityOverview = {
  appointments: 100,
  newPatients: 50,
  medicinesSold: 500,
  labTests: 100,
}

export const topMedicines: TopMedicine[] = [
  { name: "Paracetamol", percentage: 35, color: "#4F46E5" },
  { name: "Vitamin Tablets", percentage: 25, color: "#10B981" },
  { name: "Antibiotics", percentage: 20, color: "#F59E0B" },
  { name: "Others", percentage: 20, color: "#6B7280" },
]

export const patientFees: PatientFee[] = [
  { patientId: "p5", amount: 150, status: "pending", date: "2023-05-15" },
  { patientId: "p1", amount: 200, status: "pending", date: "2023-05-16" },
  { patientId: "p4", amount: 175, status: "pending", date: "2023-05-17" },
  { patientId: "p3", amount: 225, status: "pending", date: "2023-05-18" },
]

// Data service functions
export const getPatients = () => patients
export const getPatient = (id: string) => patients.find((patient) => patient.id === id)

export const getDoctors = () => doctors
export const getDoctor = (id: string) => doctors.find((doctor) => doctor.id === id)

export const getAppointments = () => appointments
export const getAppointmentsByStatus = (status: Appointment["status"]) =>
  appointments.filter((appointment) => appointment.status === status)

export const getMessages = (userId: string) =>
  messages.filter((message) => message.senderId === userId || message.receiverId === userId)

export const getMedicineProducts = () => medicineProducts
export const getMedicineProduct = (id: string) => medicineProducts.find((product) => product.id === id)

export const getEducationContents = () => educationContents
export const getEducationContent = (id: string) => educationContents.find((content) => content.id === id)

export const getActivityOverview = () => activityOverview

export const getTopMedicines = () => topMedicines

export const getPatientFees = () => patientFees
export const getPatientFeesByPatientId = (patientId: string) => patientFees.filter((fee) => fee.patientId === patientId)
