// Comprehensive medical data for offline access
export interface MedicalCondition {
  id: string;
  title: string;
  category: string;
  symptoms: string[];
  causes: string[];
  homeRemedies: string[];
  whenToSeekCare: string[];
  prevention: string[];
  priority: 'high' | 'medium' | 'low';
}

export const medicalConditionsData: MedicalCondition[] = [
  {
    id: 'fever',
    title: 'Fever',
    category: 'common-conditions',
    symptoms: [
      'Body temperature above 100.4°F (38°C)',
      'Chills and shivering',
      'Sweating',
      'Headache',
      'Muscle aches',
      'Loss of appetite',
      'Dehydration',
      'General weakness'
    ],
    causes: [
      'Viral infections (flu, cold)',
      'Bacterial infections',
      'Vaccinations',
      'Heat exhaustion',
      'Inflammatory conditions',
      'Medications',
      'Cancer',
      'Autoimmune disorders'
    ],
    homeRemedies: [
      'Rest and stay in bed',
      'Drink plenty of fluids (water, herbal tea, broth)',
      'Take acetaminophen or ibuprofen as directed',
      'Use cool compress on forehead',
      'Wear light, breathable clothing',
      'Take lukewarm bath or shower',
      'Stay in cool, comfortable environment',
      'Eat light, easy-to-digest foods'
    ],
    whenToSeekCare: [
      'Temperature above 103°F (39.4°C)',
      'Fever lasts more than 3 days',
      'Difficulty breathing or chest pain',
      'Severe headache or stiff neck',
      'Persistent vomiting or diarrhea',
      'Signs of dehydration',
      'Confusion or altered mental state',
      'Rash that spreads rapidly'
    ],
    prevention: [
      'Wash hands frequently',
      'Avoid close contact with sick people',
      'Get recommended vaccinations',
      'Maintain good hygiene',
      'Stay hydrated',
      'Get adequate sleep',
      'Eat nutritious diet',
      'Exercise regularly'
    ],
    priority: 'medium'
  },
  
  {
    id: 'cold',
    title: 'Common Cold',
    category: 'respiratory',
    symptoms: [
      'Runny or stuffy nose',
      'Sneezing',
      'Mild cough',
      'Sore throat',
      'Low-grade fever',
      'Mild headache',
      'Body aches',
      'Post-nasal drip'
    ],
    causes: [
      'Rhinovirus (most common)',
      'Coronavirus',
      'Respiratory syncytial virus (RSV)',
      'Adenovirus',
      'Human parainfluenza virus',
      'Airborne droplets from coughs/sneezes',
      'Touching contaminated surfaces',
      'Close contact with infected persons'
    ],
    homeRemedies: [
      'Get plenty of rest (8-10 hours sleep)',
      'Stay hydrated with warm liquids',
      'Use saline nasal spray or rinse',
      'Gargle with warm salt water',
      'Use humidifier or breathe steam',
      'Drink warm tea with honey',
      'Eat chicken soup',
      'Take vitamin C supplements'
    ],
    whenToSeekCare: [
      'Symptoms worsen after 7-10 days',
      'High fever (101.3°F or higher)',
      'Severe headache or sinus pain',
      'Difficulty breathing or wheezing',
      'Ear pain or discharge',
      'Persistent cough with thick mucus',
      'Symptoms of secondary infection'
    ],
    prevention: [
      'Wash hands frequently with soap',
      'Avoid touching face with unwashed hands',
      'Stay away from people who are sick',
      'Disinfect frequently touched surfaces',
      'Don\'t share personal items',
      'Maintain healthy immune system',
      'Get adequate sleep',
      'Manage stress levels'
    ],
    priority: 'low'
  },
  
  {
    id: 'cough',
    title: 'Cough',
    category: 'respiratory',
    symptoms: [
      'Persistent coughing (dry or productive)',
      'Throat irritation',
      'Chest discomfort',
      'Mucus production (wet cough)',
      'Hoarse voice',
      'Shortness of breath',
      'Fatigue from coughing',
      'Sleep disturbance'
    ],
    causes: [
      'Viral upper respiratory infections',
      'Bacterial infections',
      'Allergies',
      'Asthma',
      'Gastroesophageal reflux (GERD)',
      'Smoking or secondhand smoke',
      'Air pollution',
      'Medications (ACE inhibitors)'
    ],
    homeRemedies: [
      'Drink warm liquids (tea, broth, warm water with honey)',
      'Use humidifier or steam inhalation',
      'Take honey (1-2 teaspoons before bed)',
      'Stay hydrated throughout the day',
      'Elevate head while sleeping',
      'Avoid irritants (smoke, strong odors)',
      'Suck on throat lozenges or hard candy',
      'Try over-the-counter cough suppressants'
    ],
    whenToSeekCare: [
      'Cough persists more than 3 weeks',
      'Coughing up blood or pink foam',
      'High fever (102°F or higher)',
      'Difficulty breathing or wheezing',
      'Chest pain or pressure',
      'Rapid weight loss',
      'Night sweats',
      'Thick, green, or yellow mucus'
    ],
    prevention: [
      'Avoid respiratory irritants',
      'Don\'t smoke or quit smoking',
      'Get annual flu vaccination',
      'Practice good hand hygiene',
      'Stay away from sick people',
      'Manage allergies properly',
      'Stay hydrated',
      'Use air purifier if needed'
    ],
    priority: 'medium'
  },
  
  {
    id: 'headache',
    title: 'Headache',
    category: 'neurological',
    symptoms: [
      'Head pain (dull, throbbing, or sharp)',
      'Pressure sensation in head',
      'Sensitivity to light or sound',
      'Nausea or vomiting',
      'Neck or shoulder tension',
      'Visual disturbances',
      'Dizziness',
      'Difficulty concentrating'
    ],
    causes: [
      'Tension and stress',
      'Dehydration',
      'Lack of sleep',
      'Eye strain',
      'Hormonal changes',
      'Certain foods (chocolate, aged cheese)',
      'Weather changes',
      'Medication overuse'
    ],
    homeRemedies: [
      'Rest in dark, quiet room',
      'Apply cold or warm compress to head/neck',
      'Stay well hydrated (8-10 glasses water daily)',
      'Practice relaxation techniques',
      'Gentle neck and shoulder massage',
      'Take over-the-counter pain relievers as directed',
      'Maintain regular sleep schedule',
      'Try peppermint or lavender oil'
    ],
    whenToSeekCare: [
      'Sudden, severe headache ("worst headache of life")',
      'Headache with fever and stiff neck',
      'Headache after head injury',
      'Headache with vision changes',
      'Headache with weakness or numbness',
      'Headache pattern changes significantly',
      'Headache with confusion or difficulty speaking',
      'Chronic daily headaches'
    ],
    prevention: [
      'Maintain consistent sleep schedule',
      'Stay hydrated throughout day',
      'Manage stress with relaxation techniques',
      'Avoid known trigger foods',
      'Exercise regularly',
      'Limit screen time and take breaks',
      'Practice good posture',
      'Avoid skipping meals'
    ],
    priority: 'medium'
  },
  
  {
    id: 'stomachache',
    title: 'Stomach Ache',
    category: 'gastrointestinal',
    symptoms: [
      'Abdominal pain or cramping',
      'Nausea',
      'Vomiting',
      'Bloating',
      'Gas',
      'Loss of appetite',
      'Diarrhea or constipation',
      'Heartburn or acid reflux'
    ],
    causes: [
      'Indigestion from overeating',
      'Food poisoning',
      'Viral gastroenteritis (stomach flu)',
      'Stress and anxiety',
      'Menstrual cramps',
      'Lactose intolerance',
      'Peptic ulcer',
      'Irritable bowel syndrome (IBS)'
    ],
    homeRemedies: [
      'Rest and avoid solid foods temporarily',
      'Stay hydrated with clear liquids',
      'Try BRAT diet (Bananas, Rice, Applesauce, Toast)',
      'Apply heating pad to abdomen',
      'Drink ginger tea or peppermint tea',
      'Take small, frequent sips of water',
      'Avoid dairy, caffeine, and spicy foods',
      'Practice relaxation techniques'
    ],
    whenToSeekCare: [
      'Severe abdominal pain',
      'Blood in vomit or stool',
      'Signs of dehydration',
      'High fever (101°F or higher)',
      'Persistent vomiting',
      'Abdominal pain that worsens',
      'Signs of appendicitis (right lower quadrant pain)',
      'Symptoms last more than 24 hours'
    ],
    prevention: [
      'Eat slowly and chew food thoroughly',
      'Avoid trigger foods',
      'Don\'t eat large meals before bedtime',
      'Stay hydrated',
      'Practice good food safety',
      'Manage stress levels',
      'Exercise regularly',
      'Avoid excessive alcohol and caffeine'
    ],
    priority: 'medium'
  },
  
  {
    id: 'nausea',
    title: 'Nausea & Vomiting',
    category: 'gastrointestinal',
    symptoms: [
      'Feeling of uneasiness in stomach',
      'Urge to vomit',
      'Loss of appetite',
      'Dizziness',
      'Sweating',
      'Increased salivation',
      'Abdominal discomfort',
      'Weakness'
    ],
    causes: [
      'Motion sickness',
      'Food poisoning',
      'Viral infections',
      'Pregnancy (morning sickness)',
      'Medication side effects',
      'Stress and anxiety',
      'Migraine headaches',
      'Inner ear problems'
    ],
    homeRemedies: [
      'Sip clear liquids slowly',
      'Try ginger (tea, candies, or supplements)',
      'Eat small amounts of bland foods',
      'Rest in comfortable position',
      'Use peppermint tea or aromatherapy',
      'Apply cool compress to forehead',
      'Practice deep breathing exercises',
      'Avoid strong odors and fatty foods'
    ],
    whenToSeekCare: [
      'Blood in vomit',
      'Severe dehydration signs',
      'High fever with vomiting',
      'Severe abdominal pain',
      'Persistent vomiting for 24+ hours',
      'Signs of food poisoning in multiple people',
      'Headache with vomiting and neck stiffness',
      'Confusion or altered mental state'
    ],
    prevention: [
      'Eat small, frequent meals',
      'Avoid trigger foods and smells',
      'Stay hydrated',
      'Manage motion sickness with medication',
      'Avoid reading while traveling',
      'Get fresh air when feeling nauseous',
      'Manage stress and anxiety',
      'Take medications with food if recommended'
    ],
    priority: 'medium'
  },
  
  {
    id: 'dizziness',
    title: 'Dizziness',
    category: 'neurological',
    symptoms: [
      'Feeling unsteady or off-balance',
      'Spinning sensation (vertigo)',
      'Lightheadedness',
      'Nausea',
      'Sweating',
      'Difficulty walking',
      'Feeling faint',
      'Confusion'
    ],
    causes: [
      'Dehydration',
      'Low blood pressure',
      'Inner ear problems',
      'Medication side effects',
      'Low blood sugar',
      'Anemia',
      'Heart rhythm problems',
      'Anxiety or panic attacks'
    ],
    homeRemedies: [
      'Sit or lie down immediately',
      'Drink water slowly',
      'Avoid sudden movements',
      'Focus on a fixed point',
      'Practice deep breathing',
      'Eat something if blood sugar is low',
      'Rest in a quiet, dark room',
      'Avoid driving or operating machinery'
    ],
    whenToSeekCare: [
      'Severe or persistent dizziness',
      'Dizziness with chest pain',
      'Dizziness with severe headache',
      'Loss of consciousness',
      'Difficulty speaking or walking',
      'Hearing loss or ear pain',
      'High fever with dizziness',
      'Heart palpitations'
    ],
    prevention: [
      'Stay well hydrated',
      'Rise slowly from sitting or lying',
      'Avoid sudden head movements',
      'Manage blood pressure',
      'Take medications as prescribed',
      'Avoid excessive alcohol',
      'Get regular exercise',
      'Manage stress and anxiety'
    ],
    priority: 'medium'
  },
  
  {
    id: 'fatigue',
    title: 'Fatigue',
    category: 'general',
    symptoms: [
      'Persistent tiredness',
      'Lack of energy',
      'Difficulty concentrating',
      'Muscle weakness',
      'Drowsiness during day',
      'Lack of motivation',
      'Irritability',
      'Memory problems'
    ],
    causes: [
      'Lack of sleep',
      'Stress and anxiety',
      'Poor diet or nutrition',
      'Sedentary lifestyle',
      'Medical conditions (anemia, thyroid)',
      'Medications',
      'Depression',
      'Dehydration'
    ],
    homeRemedies: [
      'Get 7-9 hours quality sleep nightly',
      'Maintain regular sleep schedule',
      'Exercise regularly but not before bedtime',
      'Eat balanced, nutritious meals',
      'Stay hydrated throughout day',
      'Manage stress with relaxation techniques',
      'Limit caffeine, especially afternoon',
      'Take short power naps if needed (20-30 min)'
    ],
    whenToSeekCare: [
      'Persistent fatigue for several weeks',
      'Fatigue interfering with daily activities',
      'Unexplained weight loss',
      'Severe fatigue with other symptoms',
      'Depression or mood changes',
      'Shortness of breath with minimal exertion',
      'Joint pain or muscle aches',
      'Changes in appetite or sleep patterns'
    ],
    prevention: [
      'Maintain regular sleep schedule',
      'Exercise regularly',
      'Eat healthy, balanced diet',
      'Manage stress effectively',
      'Stay hydrated',
      'Limit alcohol and caffeine',
      'Take breaks during work',
      'Address underlying health conditions'
    ],
    priority: 'low'
  }
];

// Emergency first aid instructions
export const emergencyFirstAid = {
  cpr: {
    title: 'CPR Instructions',
    steps: [
      'Check responsiveness - tap shoulders, shout "Are you okay?"',
      'Call 911 immediately or have someone else call',
      'Position person on firm surface, tilt head back, lift chin',
      'Place heel of hand on center of chest between nipples',
      'Place other hand on top, interlace fingers',
      'Push hard and fast at least 2 inches deep',
      'Allow complete chest recoil between compressions',
      'Give 30 chest compressions at 100-120 per minute',
      'Give 2 rescue breaths if trained',
      'Continue 30:2 ratio until help arrives'
    ]
  },
  choking: {
    title: 'Choking First Aid',
    consciousAdult: [
      'Ask "Are you choking?" - if they can\'t speak, cough, or breathe',
      'Stand behind person, wrap arms around waist',
      'Make fist, place thumb side against upper abdomen above navel',
      'Grasp fist with other hand',
      'Press into abdomen with quick upward thrusts',
      'Repeat until object comes out or person becomes unconscious'
    ],
    unconscious: [
      'Call 911 immediately',
      'Begin CPR with chest compressions',
      'Before giving breaths, look for object in mouth',
      'If you see object, try to remove with finger sweep',
      'Continue CPR until help arrives'
    ]
  }
};

// Emergency contacts and numbers
export const emergencyContacts = [
  { service: 'Emergency Services (US)', number: '911', description: 'Police, Fire, Ambulance' },
  { service: 'Poison Control (US)', number: '1-800-222-1222', description: '24/7 poison emergency' },
  { service: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Mental health crisis' },
  { service: 'Suicide Prevention Lifeline', number: '988', description: '24/7 suicide prevention' },
  { service: 'India Emergency', number: '112', description: 'All emergency services' },
  { service: 'India Ambulance', number: '102', description: 'Medical emergency' },
  { service: 'UK Emergency', number: '999', description: 'Police, Fire, Ambulance' },
  { service: 'Australia Emergency', number: '000', description: 'Police, Fire, Ambulance' }
];

export const doctorCredentials = [
  {
    licenseNumber: 'MD123456',
    pin: '1234',
    name: 'Dr. Sarah Johnson',
    specialization: 'Family Medicine'
  },
  {
    licenseNumber: 'MD789012',
    pin: '5678', 
    name: 'Dr. Michael Chen',
    specialization: 'Internal Medicine'
  },
  {
    licenseNumber: 'MD555000',
    pin: '9999',
    name: 'Dr. Priya Sharma', 
    specialization: 'Pediatrics'
  },
  {
    licenseNumber: 'MD777888',
    pin: '0000',
    name: 'Dr. James Wilson',
    specialization: 'Emergency Medicine'
  }
];