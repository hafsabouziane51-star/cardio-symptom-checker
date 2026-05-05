// =========================================================
// ECG SMART CALCULATOR - JavaScript
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== BURGER MENU TOGGLE =====
    const burgerButton = document.getElementById('menu-button');
    const navList = document.querySelector('.nav__list');

    if (burgerButton && navList) {
        burgerButton.addEventListener('click', (e) => {
            e.preventDefault();
            navList.classList.toggle('active');
            
            // Toggle burger icon between menu and close
            const icon = burgerButton.querySelector('i');
            if(navList.classList.contains('active')){
                icon.classList.replace('ri-menu-line', 'ri-close-line');
            } else {
                icon.classList.replace('ri-close-line', 'ri-menu-line');
            }
        });

        // Toggle body scroll lock
        document.body.classList.toggle('menu-open', navList.classList.contains('active'));
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !burgerButton.contains(e.target)) {
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = burgerButton.querySelector('i');
                icon.classList.replace('ri-close-line', 'ri-menu-line');
            }
        });

        // Close menu when clicking a nav link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = burgerButton.querySelector('i');
                icon.classList.replace('ri-close-line', 'ri-menu-line');
            });
        });
        
        // Escape key closes menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = burgerButton.querySelector('i');
                icon.classList.replace('ri-close-line', 'ri-menu-line');
            }
        });
    }

    // ===== DARK/LIGHT MODE TOGGLE =====
    const themeButton = document.getElementById('theme-button');

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            // Toggle Light Mode class on body
            document.body.classList.toggle('light-theme');
            
            // Toggle icon between moon and sun
            if (document.body.classList.contains('light-theme')) {
                themeButton.classList.replace('ri-moon-line', 'ri-sun-line');
                // Save preference to localStorage
                localStorage.setItem('theme', 'light');
            } else {
                themeButton.classList.replace('ri-sun-line', 'ri-moon-line');
                // Save preference to localStorage
                localStorage.setItem('theme', 'dark');
            }
        });

        // Check for saved theme preference on page load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeButton.classList.replace('ri-moon-line', 'ri-sun-line');
        }
    }

    // ===== ECG WAVE ANIMATION =====
    const svg = document.querySelector('.ecg-wave');
    const path = document.getElementById('ecgPath');
    const peaksGroup = document.getElementById('peaks');

    if (svg && path && peaksGroup) {
        const baseline = 150;
        const amplitude = 60;
        const heartbeatWidth = 180;
        const numHeartbeats = 5;

        function generateHeartbeat(offsetX) {
            const points = [];

            for (let x = 0; x <= heartbeatWidth; x += 2) {
                let y = baseline;
                const t = x / heartbeatWidth;

                // P wave
                if (t > 0.08 && t < 0.18) {
                    const pt = (t - 0.08) / 0.1;
                    y = baseline - Math.sin(pt * Math.PI) * amplitude * 0.15;
                }

                // QRS complex
                else if (t > 0.25 && t < 0.38) {
                    const qt = (t - 0.25) / 0.13;
                    if (qt < 0.3) {
                        y = baseline + amplitude * 0.2;
                    } else if (qt < 0.6) {
                        y = baseline - amplitude * 1.5;
                    } else {
                        y = baseline + amplitude * 0.6;
                    }
                }

                // T wave
                else if (t > 0.45 && t < 0.7) {
                    const tt = (t - 0.45) / 0.25;
                    y = baseline - Math.sin(tt * Math.PI) * amplitude * 0.3;
                }

                points.push({ x: offsetX + x, y });
            }

            return points;
        }

        function generateECG() {
            // Clear previous peaks
            peaksGroup.innerHTML = "";

            let allPoints = [];

            for (let i = 0; i < numHeartbeats; i++) {
                const offsetX = i * heartbeatWidth;
                const heartbeatPoints = generateHeartbeat(offsetX);
                allPoints = allPoints.concat(heartbeatPoints);

                // Create glowing peak (R-wave peak)
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "peak");
                circle.setAttribute("cx", offsetX + heartbeatWidth * 0.32);
                circle.setAttribute("cy", baseline - amplitude * 1.5);
                circle.setAttribute("r", "4");
                circle.setAttribute("fill", "#00FF88");
                peaksGroup.appendChild(circle);
            }

            // Build the path d attribute
            let d = `M ${allPoints[0].x} ${allPoints[0].y}`;
            for (let i = 1; i < allPoints.length; i++) {
                d += ` L ${allPoints[i].x} ${allPoints[i].y}`;
            }

            path.setAttribute("d", d);

            // Animate the ECG line
            animateECG();
        }

        function animateECG() {
            const length = path.getTotalLength();
            
            // Set initial state - hidden line
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = 'none';
            
            // Start animation after a brief delay
            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 4s linear';
                path.style.strokeDashoffset = '0';
            }, 100);
            
            // Loop the animation
            setTimeout(function loopAnimation() {
                path.style.transition = 'none';
                path.style.strokeDashoffset = length;
                
                setTimeout(() => {
                    path.style.transition = 'stroke-dashoffset 4s linear';
                    path.style.strokeDashoffset = '0';
                }, 100);
                
                setTimeout(loopAnimation, 4100);
            }, 4100);
        }

        // Generate and display ECG
        generateECG();
    }

    // ===== CONTACT FORM HANDLER =====
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e){
            e.preventDefault();

            // Validate fields
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();

            if(!name || !email || !message){
                formMessage.textContent = "Please fill in all fields!";
                formMessage.style.color = "var(--error)";
                formMessage.style.display = "block";
                return;
            }

            // Show success message (form submission will continue to web3forms)
            formMessage.textContent = "Message sent successfully!";
            formMessage.style.color = "var(--success)";
            formMessage.style.display = "block";

            // Reset form after successful submission (optional - let form submit naturally)
            // contactForm.reset();
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== ADD SCROLL REVEAL ANIMATION =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature__card, .how-use__step, .info-card').forEach(el => {
        observer.observe(el);
    });

});

// =========================================================
// ECG CALCULATOR FUNCTIONS
// =========================================================

// Current rhythm type
let currentRhythm = 'regular';

// Lead polarity storage
let leadIPolarity = 'positive';
let leadIIPolarity = 'positive';

// Heart Rate Calculator - Rhythm Selection
function selectRhythm(rhythm) {
    currentRhythm = rhythm;
    
    // Update button states
    document.querySelectorAll('.rhythm-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.rhythm === rhythm) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide appropriate input section
    if (rhythm === 'regular') {
        document.getElementById('regular-input').classList.remove('hidden');
        document.getElementById('irregular-input').classList.add('hidden');
    } else {
        document.getElementById('regular-input').classList.add('hidden');
        document.getElementById('irregular-input').classList.remove('hidden');
    }
    
    // Clear previous result
    document.getElementById('hr-value').textContent = '--';
    document.getElementById('hr-interpretation').textContent = '';
}

// Heart Rate Calculator - Regular Rhythm
function calculateHRRegular() {
    const rrInterval = parseFloat(document.getElementById('rr-interval').value);
    
    if (isNaN(rrInterval) || rrInterval <= 0) {
        showHRResult(null, 'Please enter a valid RR interval');
        return;
    }
    
    // HR = 1500 ÷ RR interval (small squares)
    const hr = Math.round(1500 / rrInterval);
    
    let interpretation = '';
    if (hr >= 60 && hr <= 100) {
        interpretation = 'Normal Heart Rate';
    } else if (hr < 60) {
        interpretation = 'Bradycardia (Slow Heart Rate)';
    } else {
        interpretation = 'Tachycardia (Fast Heart Rate)';
    }
    
    showHRResult(hr, interpretation);
}

function showHRResult(hr, interpretation) {
    const hrValue = document.getElementById('hr-value');
    const hrInterpretation = document.getElementById('hr-interpretation');
    
    if (hr !== null) {
        hrValue.textContent = hr;
    } else {
        hrValue.textContent = '--';
    }
    hrInterpretation.textContent = interpretation;
}

// Heart Rate Calculator - Irregular Rhythm
function calculateHRIrregular() {
    const qrsCount = parseInt(document.getElementById('qrs-count').value);
    
    if (isNaN(qrsCount) || qrsCount < 0) {
        showHRResult(null, 'Please enter a valid QRS count');
        return;
    }
    
    // HR ≈ Number of QRS complexes × 30
    const hr = qrsCount * 30;
    
    let interpretation = '';
    if (qrsCount === 0) {
        interpretation = 'No QRS complexes detected - Check input';
    } else if (qrsCount >= 2 && qrsCount <= 4) {
        interpretation = 'Normal Heart Rate (estimated)';
    } else if (qrsCount < 2) {
        interpretation = 'Bradycardia (Slow Heart Rate)';
    } else {
        interpretation = 'Tachycardia (Fast Heart Rate)';
    }
    
    showHRResult(hr, interpretation);
}

// ECG Measurement Module - Calculate All Measurements
function calculateAllMeasurements() {
    calculatePRInterval();
    calculateQRSDuration();
    calculateQTInterval();
}

// PR Interval Calculation
function calculatePRInterval() {
    const prInput = parseFloat(document.getElementById('pr-interval').value);
    const prMsElement = document.getElementById('pr-ms');
    const prInterpretationBox = document.getElementById('pr-interpretation');
    
    if (isNaN(prInput) || prInput < 0) {
        prMsElement.textContent = '-- ms';
        prInterpretationBox.className = 'interpretation-box';
        prInterpretationBox.querySelector('.interpretation-text').textContent = 'Enter a valid value';
        return;
    }
    
    // Convert to milliseconds (1 small square = 40 ms)
    const prMs = Math.round(prInput * 40);
    prMsElement.textContent = prMs + ' ms';
    
    // Interpretation
    let interpretation = '';
    let className = 'interpretation-box';
    
    if (prInput < 2) {
        interpretation = 'Short PR Interval';
        className += ' warning';
    } else if (prInput > 5) {
        interpretation = 'First Degree AV Block';
        className += ' danger';
    } else {
        interpretation = 'Normal PR Interval';
        className += ' normal';
    }
    
    prInterpretationBox.className = className;
    prInterpretationBox.querySelector('.interpretation-text').textContent = interpretation;
}

// QRS Duration Calculation
function calculateQRSDuration() {
    const qrsInput = parseFloat(document.getElementById('qrs-duration').value);
    const qrsMsElement = document.getElementById('qrs-ms');
    const qrsInterpretationBox = document.getElementById('qrs-interpretation');
    
    if (isNaN(qrsInput) || qrsInput < 0) {
        qrsMsElement.textContent = '-- ms';
        qrsInterpretationBox.className = 'interpretation-box';
        qrsInterpretationBox.querySelector('.interpretation-text').textContent = 'Enter a valid value';
        return;
    }
    
    // Convert to milliseconds (1 small square = 40 ms)
    const qrsMs = Math.round(qrsInput * 40);
    qrsMsElement.textContent = qrsMs + ' ms';
    
    // Interpretation (Normal: <3 small squares = <120ms, BBB: ≥3 small squares = ≥120ms)
    let interpretation = '';
    let className = 'interpretation-box';
    
    if (qrsInput >= 3) {
        interpretation = 'Bundle Branch Block';
        className += ' danger';
    } else {
        interpretation = 'Normal QRS Duration';
        className += ' normal';
    }
    
    qrsInterpretationBox.className = className;
    qrsInterpretationBox.querySelector('.interpretation-text').textContent = interpretation;
}

// QT Interval Calculation
function calculateQTInterval() {
    const qtInput = parseFloat(document.getElementById('qt-interval').value);
    const qtMsElement = document.getElementById('qt-ms');
    const qtInterpretationBox = document.getElementById('qt-interpretation');
    
    if (isNaN(qtInput) || qtInput < 0) {
        qtMsElement.textContent = '-- ms';
        qtInterpretationBox.className = 'interpretation-box';
        qtInterpretationBox.querySelector('.interpretation-text').textContent = 'Enter a valid value';
        return;
    }
    
    // Convert to milliseconds (1 small square = 40 ms)
    const qtMs = Math.round(qtInput * 40);
    qtMsElement.textContent = qtMs + ' ms';
    
    // Interpretation (Normal: ≤11 small squares = ≤440ms, Prolonged: >11 small squares)
    let interpretation = '';
    let className = 'interpretation-box';
    
    if (qtInput > 11) {
        interpretation = 'Prolonged QT Interval';
        className += ' danger';
    } else {
        interpretation = 'Normal QT Interval';
        className += ' normal';
    }
    
    qtInterpretationBox.className = className;
    qtInterpretationBox.querySelector('.interpretation-text').textContent = interpretation;
}

// ECG Axis Calculator - Set Lead Polarity
function setLeadPolarity(lead, polarity) {
    if (lead === 'I') {
        leadIPolarity = polarity;
    } else if (lead === 'II') {
        leadIIPolarity = polarity;
    }
    
    // Update button states
    document.querySelectorAll(`.polarity-btn[data-lead="${lead}"]`).forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.polarity === polarity) {
            btn.classList.add('active');
        }
    });
}

// ECG Axis Calculator - Calculate Axis
function calculateAxis() {
    const axisNameElement = document.getElementById('axis-name');
    const axisRangeElement = document.getElementById('axis-range');
    const axisIndicator = document.getElementById('axis-indicator');
    
    let axisName = '';
    let axisRange = '';
    let axisClass = '';
    let rotation = 0;
    
    // Clear previous quadrant highlights
    document.querySelectorAll('.quadrant').forEach(q => q.classList.remove('active'));
    
    // Determine axis based on Lead I and Lead II polarity
    if (leadIPolarity === 'positive' && leadIIPolarity === 'positive') {
        // Normal Axis (−30° to +90°)
        axisName = 'Normal Axis';
        axisRange = '−30° to +90°';
        axisClass = 'normal';
        rotation = 30;
        document.querySelector('.quadrant.normal').classList.add('active');
    } else if (leadIPolarity === 'positive' && leadIIPolarity === 'negative') {
        // Left Axis Deviation (LAD) (−30° to −90°)
        axisName = 'Left Axis Deviation';
        axisRange = '−30° to −90°';
        axisClass = 'lad';
        rotation = -60;
        document.querySelector('.quadrant.lad').classList.add('active');
    } else if (leadIPolarity === 'negative' && leadIIPolarity === 'positive') {
        // Right Axis Deviation (RAD) (+90° to +180°)
        axisName = 'Right Axis Deviation';
        axisRange = '+90° to +180°';
        axisClass = 'rad';
        rotation = 120;
        document.querySelector('.quadrant.rad').classList.add('active');
    } else if (leadIPolarity === 'negative' && leadIIPolarity === 'negative') {
        // Extreme Axis (rare, outside normal ranges)
        axisName = 'Extreme Axis';
        axisRange = '−90° to −180° or +180°';
        axisClass = 'extreme';
        rotation = 180;
        document.querySelector('.quadrant.extreme').classList.add('active');
    }
    
    // Update text result
    axisNameElement.textContent = axisName;
    axisNameElement.className = 'axis-value ' + axisClass;
    axisRangeElement.textContent = axisRange;
    
    // Update compass indicator
    const arrow = axisIndicator.querySelector('.axis-arrow');
    const arrowHead = axisIndicator.querySelector('.axis-arrow-head');
    
    // Calculate rotation for SVG (0° is up in SVG, so we need to adjust)
    const svgRotation = rotation + 180;
    
    axisIndicator.style.transform = `rotate(${svgRotation}deg)`;
    
    // Update arrow color based on axis type
    let arrowColor = '#00ff88'; // green - normal
    if (axisClass === 'lad') {
        arrowColor = '#f97316'; // orange
    } else if (axisClass === 'rad') {
        arrowColor = '#ef4444'; // red
    } else if (axisClass === 'extreme') {
        arrowColor = '#a855f7'; // purple
    }
    
    arrow.setAttribute('stroke', arrowColor);
    arrowHead.setAttribute('fill', arrowColor);
}

// =========================================================
// SMART MEDICAL REPORT GENERATOR
// =========================================================

// Store ECG values globally so they can be retrieved
let storedECGValues = {
    heartRate: null,
    heartRateStatus: null,
    prInterval: null,
    prIntervalMs: null,
    prStatus: null,
    qrsDuration: null,
    qrsDurationMs: null,
    qrsStatus: null,
    qtInterval: null,
    qtIntervalMs: null,
    qtStatus: null,
    electricalAxis: null,
    electricalAxisRange: null
};

// Override existing functions to store values
const originalCalculateHRRegular = calculateHRRegular;
calculateHRRegular = function() {
    originalCalculateHRRegular();
    const hrValue = document.getElementById('hr-value').textContent;
    const hrInterpretation = document.getElementById('hr-interpretation').textContent;
    if (hrValue !== '--') {
        storedECGValues.heartRate = hrValue;
        storedECGValues.heartRateStatus = hrInterpretation;
    }
};

const originalCalculateHRIrregular = calculateHRIrregular;
calculateHRIrregular = function() {
    originalCalculateHRIrregular();
    const hrValue = document.getElementById('hr-value').textContent;
    const hrInterpretation = document.getElementById('hr-interpretation').textContent;
    if (hrValue !== '--') {
        storedECGValues.heartRate = hrValue;
        storedECGValues.heartRateStatus = hrInterpretation;
    }
};

const originalCalculatePRInterval = calculatePRInterval;
calculatePRInterval = function() {
    originalCalculatePRInterval();
    const prInput = parseFloat(document.getElementById('pr-interval').value);
    const prMs = document.getElementById('pr-ms').textContent;
    const prInterpretation = document.getElementById('pr-interpretation');
    if (!isNaN(prInput) && prInput >= 0) {
        storedECGValues.prInterval = prInput;
        storedECGValues.prIntervalMs = prMs;
        storedECGValues.prStatus = prInterpretation.querySelector('.interpretation-text').textContent;
    }
};

const originalCalculateQRSDuration = calculateQRSDuration;
calculateQRSDuration = function() {
    originalCalculateQRSDuration();
    const qrsInput = parseFloat(document.getElementById('qrs-duration').value);
    const qrsMs = document.getElementById('qrs-ms').textContent;
    const qrsInterpretation = document.getElementById('qrs-interpretation');
    if (!isNaN(qrsInput) && qrsInput >= 0) {
        storedECGValues.qrsDuration = qrsInput;
        storedECGValues.qrsDurationMs = qrsMs;
        storedECGValues.qrsStatus = qrsInterpretation.querySelector('.interpretation-text').textContent;
    }
};

const originalCalculateQTInterval = calculateQTInterval;
calculateQTInterval = function() {
    originalCalculateQTInterval();
    const qtInput = parseFloat(document.getElementById('qt-interval').value);
    const qtMs = document.getElementById('qt-ms').textContent;
    const qtInterpretation = document.getElementById('qt-interpretation');
    if (!isNaN(qtInput) && qtInput >= 0) {
        storedECGValues.qtInterval = qtInput;
        storedECGValues.qtIntervalMs = qtMs;
        storedECGValues.qtStatus = qtInterpretation.querySelector('.interpretation-text').textContent;
    }
};

const originalCalculateAxis = calculateAxis;
calculateAxis = function() {
    originalCalculateAxis();
    const axisName = document.getElementById('axis-name').textContent;
    const axisRange = document.getElementById('axis-range').textContent;
    if (axisName !== '--') {
        storedECGValues.electricalAxis = axisName;
        storedECGValues.electricalAxisRange = axisRange;
    }
};

// BMI Calculation with WHO Classification
function calculateBMI(weight, heightCm) {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;
    
    let classification = '';
    let className = '';
    
    if (bmi < 18.5) {
        classification = 'Underweight';
        className = 'underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        classification = 'Normal Weight';
        className = 'normal';
    } else if (bmi >= 25 && bmi <= 29.9) {
        classification = 'Overweight';
        className = 'overweight';
    } else {
        classification = 'Obese';
        className = 'obese';
    }
    
    return { bmi: bmiRounded, classification, className };
}

// Get ECG Values from existing modules
function getECGValues() {
    return storedECGValues;
}

// Generate Medical Report
function generateMedicalReport() {
    // Get patient information
    const name = document.getElementById('patientName').value.trim();
    const age = document.getElementById('patientAge').value;
    const gender = document.getElementById('patientGender').value;
    const height = document.getElementById('patientHeight').value;
    const weight = document.getElementById('patientWeight').value;
    
    // Validate form
    if (!name || !age || !gender || !height || !weight) {
        alert('Please fill in all patient information fields.');
        return;
    }
    
    // Calculate BMI
    const bmiResult = calculateBMI(parseFloat(weight), parseFloat(height));
    
    // Get ECG values from direct input fields OR from calculator modules
    const directHR = document.getElementById('reportHeartRate').value;
    const directPR = document.getElementById('reportPRInterval').value;
    const directQRS = document.getElementById('reportQRSDuration').value;
    const directQT = document.getElementById('reportQTInterval').value;
    const directAxis = document.getElementById('reportElectricalAxis').value;
    
    // Get stored ECG values from calculator modules
    const storedValues = getECGValues();
    
    // Merge values - direct input takes priority over calculator values
    // Calculate statuses based on the medical ranges provided
    const directHRVal = parseInt(directHR) || parseInt(storedValues.heartRate);
    const directPRVal = parseFloat(directPR) || (storedValues.prInterval ? storedValues.prInterval * 40 : null);
    const directQRSVal = parseFloat(directQRS) || (storedValues.qrsDuration ? storedValues.qrsDuration * 40 : null);
    const directQTSmallSquares = directQT ? parseFloat(directQT) : storedValues.qtInterval;
    const directQTMs = directQTSmallSquares ? Math.round(directQTSmallSquares * 40) : null;
    
    // Heart Rate Status
    let hrStatus = 'Not calculated';
    if (!isNaN(directHRVal)) {
        if (directHRVal < 60) {
            hrStatus = 'Bradycardia';
        } else if (directHRVal <= 100) {
            hrStatus = 'Normal Sinus Rhythm';
        } else if (directHRVal <= 150) {
            hrStatus = 'Tachycardia';
        } else {
            hrStatus = 'Severe Tachycardia';
        }
    }
    
    // PR Interval Status
    let prStatus = 'Not calculated';
    if (directPRVal !== null && !isNaN(directPRVal)) {
        if (directPRVal < 120) {
            prStatus = 'Short PR Interval';
        } else if (directPRVal <= 200) {
            prStatus = 'Normal PR Interval';
        } else {
            prStatus = 'First-Degree AV Block';
        }
    }
    
    // QRS Duration Status
    let qrsStatus = 'Not calculated';
    if (directQRSVal !== null && !isNaN(directQRSVal)) {
        if (directQRSVal < 120) {
            qrsStatus = 'Normal QRS Duration';
        } else if (directQRSVal <= 140) {
            qrsStatus = 'Mild QRS Prolongation';
        } else {
            qrsStatus = 'Wide QRS / Possible Bundle Branch Block';
        }
    }
    
    // QT Interval Status
    let qtStatus = 'Not calculated';
    if (directQTMs !== null && !isNaN(directQTMs)) {
        if (directQTMs < 350) {
            qtStatus = 'Short QT Interval';
        } else if (directQTMs <= 440) {
            qtStatus = 'Normal QT Interval';
        } else if (directQTMs <= 500) {
            qtStatus = 'Prolonged QT Interval';
        } else {
            qtStatus = 'High Risk Arrhythmia';
        }
    }
    
    // Electrical Axis Status
    let axisInput = directAxis || storedValues.electricalAxis;
    let axisStatus = 'Not calculated';
    if (axisInput) {
        axisStatus = axisInput;
    }
    
    const ecgValues = {
        heartRate: directHR || storedValues.heartRate,
        heartRateStatus: hrStatus,
        prInterval: directPR ? Math.round(parseFloat(directPR) * 40) : storedValues.prInterval,
        prIntervalMs: directPR ? directPR + ' ms' : storedValues.prIntervalMs,
        prStatus: prStatus,
        qrsDuration: directQRS ? Math.round(parseFloat(directQRS) * 40) : storedValues.qrsDuration,
        qrsDurationMs: directQRS ? directQRS + ' ms' : storedValues.qrsDurationMs,
        qrsStatus: qrsStatus,
        qtInterval: directQT ? Math.round(parseFloat(directQT) * 40) : storedValues.qtInterval,
        qtIntervalMs: directQT ? directQT + ' ms' : storedValues.qtIntervalMs,
        qtStatus: qtStatus,
        electricalAxis: axisInput,
        electricalAxisRange: directAxis ? (directAxis === 'Normal Axis' ? '−30° to +90°' : directAxis === 'Left Axis Deviation' ? '−30° to −90°' : directAxis === 'Right Axis Deviation' ? '+90° to +180°' : '−90° to −180° or +180°') : storedValues.electricalAxisRange
    };
    
    // Set current date
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('reportDate').textContent = dateStr;
    
    // Populate Patient Information
    const patientInfoHTML = `
        <div class="patient-info-item">
            <label>Name</label>
            <span>${name}</span>
        </div>
        <div class="patient-info-item">
            <label>Age</label>
            <span>${age} years</span>
        </div>
        <div class="patient-info-item">
            <label>Gender</label>
            <span>${gender}</span>
        </div>
        <div class="patient-info-item">
            <label>Height</label>
            <span>${height} cm</span>
        </div>
        <div class="patient-info-item">
            <label>Weight</label>
            <span>${weight} kg</span>
        </div>
        <div class="patient-info-item">
            <label>BMI</label>
            <span class="bmi-value">
                ${bmiResult.bmi}
                <span class="bmi-badge ${bmiResult.className}">${bmiResult.classification}</span>
            </span>
        </div>
    `;
    document.getElementById('patientInfoDisplay').innerHTML = patientInfoHTML;
    
    // Populate ECG Measurements Table
    const ecgMeasurementsBody = document.getElementById('ecgMeasurementsBody');
    let measurementsHTML = '';
    
    // Heart Rate
    const hrValue = ecgValues.heartRate || '--';
    const hrDisplayStatus = ecgValues.heartRateStatus || 'Not calculated';
    const hrStatusClass = hrValue !== '--' && parseInt(hrValue) >= 60 && parseInt(hrValue) <= 100 ? 'normal' : 'warning';
    measurementsHTML += `
        <tr>
            <td>Heart Rate</td>
            <td>${hrValue} bpm</td>
            <td>60–100 bpm</td>
            <td><span class="status-badge ${hrStatusClass}">${hrDisplayStatus}</span></td>
        </tr>
    `;
    
    // PR Interval
    const prValue = ecgValues.prIntervalMs || '--';
    const prInput = ecgValues.prInterval;
    let prStatusClass = 'normal';
    if (prInput !== undefined && prInput !== null) {
        if (prInput < 2) prStatusClass = 'warning';
        else if (prInput > 5) prStatusClass = 'abnormal';
    }
    measurementsHTML += `
        <tr>
            <td>PR Interval</td>
            <td>${prValue}</td>
            <td>120–200 ms</td>
            <td><span class="status-badge ${prStatusClass}">${ecgValues.prStatus || 'N/A'}</span></td>
        </tr>
    `;
    
    // QRS Duration
    const qrsValue = ecgValues.qrsDurationMs || '--';
    const qrsInput = ecgValues.qrsDuration;
    let qrsStatusClass = 'normal';
    if (qrsInput !== undefined && qrsInput !== null && qrsInput >= 3) {
        qrsStatusClass = 'abnormal';
    }
    measurementsHTML += `
        <tr>
            <td>QRS Duration</td>
            <td>${qrsValue}</td>
            <td><120 ms</td>
            <td><span class="status-badge ${qrsStatusClass}">${ecgValues.qrsStatus || 'N/A'}</span></td>
        </tr>
    `;
    
    // QT Interval
    const qtValue = ecgValues.qtIntervalMs || '--';
    const qtInput = ecgValues.qtInterval;
    let qtStatusClass = 'normal';
    if (qtInput !== undefined && qtInput !== null && qtInput > 11) {
        qtStatusClass = 'abnormal';
    }
    measurementsHTML += `
        <tr>
            <td>QT Interval</td>
            <td>${qtValue}</td>
            <td>350–440 ms</td>
            <td><span class="status-badge ${qtStatusClass}">${ecgValues.qtStatus || 'N/A'}</span></td>
        </tr>
    `;
    
    // Electrical Axis
    const axisValue = ecgValues.electricalAxis || '--';
    const axisRange = ecgValues.electricalAxisRange || 'N/A';
    const axisDisplayStatus = axisValue !== '--' ? axisValue : 'N/A';
    const axisStatusClass = axisValue === 'Normal Axis' ? 'normal' : (axisValue !== '--' ? 'warning' : 'normal');
    measurementsHTML += `
        <tr>
            <td>Electrical Axis</td>
            <td>${axisValue}</td>
            <td>${axisRange}</td>
            <td><span class="status-badge ${axisStatusClass}">${axisDisplayStatus}</span></td>
        </tr>
    `;
    
    ecgMeasurementsBody.innerHTML = measurementsHTML;
    
    // Generate ECG Interpretation with detailed clinical logic
    let interpretation = [];
    
    // Heart Rate Interpretation
    const hr = parseInt(ecgValues.heartRate);
    if (hr && !isNaN(hr)) {
        if (hr < 60) {
            interpretation.push("Heart rate is below normal (bradycardia). Possible causes: athlete, medications, hypothyroidism, or conduction issues.");
        } else if (hr >= 60 && hr <= 100) {
            interpretation.push("Heart rate is within normal range (60-100 bpm), suggesting stable cardiac rhythm.");
        } else {
            interpretation.push("Heart rate is above normal (tachycardia). Could be caused by stress, fever, anemia, arrhythmia, or other cardiovascular conditions.");
        }
    }
    
    // PR Interval Interpretation
    const pr = parseInt(ecgValues.prIntervalMs);
    if (pr && !isNaN(pr)) {
        if (pr < 120) {
            interpretation.push("PR interval is shorter than normal, which may indicate pre-excitation syndrome or conduction abnormalities.");
        } else if (pr >= 120 && pr <= 200) {
            interpretation.push("PR interval is within normal range (120-200 ms), indicating normal AV conduction.");
        } else {
            interpretation.push("PR interval is prolonged (>200 ms), which may suggest first-degree AV block or conduction delay.");
        }
    }
    
    // QRS Duration Interpretation
    const qrs = parseInt(ecgValues.qrsDurationMs);
    if (qrs && !isNaN(qrs)) {
        if (qrs < 120) {
            interpretation.push("QRS duration is normal (<120 ms), indicating normal ventricular depolarization.");
        } else {
            interpretation.push("QRS duration is prolonged (≥120 ms), which may indicate bundle branch block, ventricular conduction delay, or ventricular hypertrophy.");
        }
    }
    
    // QT Interval Interpretation
    const qt = parseInt(ecgValues.qtIntervalMs);
    if (qt && !isNaN(qt)) {
        if (qt < 350) {
            interpretation.push("QT interval is shorter than normal (<350 ms), which may increase risk of arrhythmias.");
        } else if (qt >= 350 && qt <= 440) {
            interpretation.push("QT interval is within normal limits (350-440 ms).");
        } else {
            interpretation.push("QT interval is prolonged (>440 ms), which may increase risk for torsades de pointes or other dangerous arrhythmias.");
        }
    }
    
    // Electrical Axis Interpretation
    const axis = ecgValues.electricalAxis;
    if (axis) {
        if (axis === 'Normal Axis') {
            interpretation.push("Electrical axis is normal (−30° to +90°), reflecting balanced ventricular depolarization.");
        } else if (axis === 'Left Axis Deviation') {
            interpretation.push("Electrical axis shows left deviation (−30° to −90°), which could indicate left ventricular hypertrophy or conduction defect.");
        } else if (axis === 'Right Axis Deviation') {
            interpretation.push("Electrical axis shows right deviation (+90° to +180°), which may suggest right ventricular hypertrophy or conduction abnormality.");
        } else if (axis === 'Extreme Axis') {
            interpretation.push("Electrical axis is abnormal (extreme), which may indicate severe conduction disturbance.");
        }
    }
    
    // Combine all interpretations
    let interpretationText = interpretation.join(" ");
    
    // Add overall assessment
    const abnormalCount = interpretation.filter(i => 
        i.includes("below normal") || 
        i.includes("above normal") || 
        i.includes("shorter than normal") || 
        i.includes("prolonged") || 
        i.includes("deviation") ||
        i.includes("abnormal")
    ).length;
    
    if (interpretation.length === 0) {
        interpretationText = "No ECG measurements available for interpretation. Please enter ECG values to generate a clinical interpretation.";
    } else if (abnormalCount === 0) {
        interpretationText += " Overall, the ECG parameters appear within normal limits, suggesting normal cardiac electrical activity.";
    } else if (abnormalCount === 1) {
        interpretationText += " Overall, most ECG parameters are within normal limits with one parameter requiring attention.";
    } else {
        interpretationText += " Overall, multiple ECG parameters are abnormal and may require clinical evaluation by a healthcare professional.";
    }
    
    document.getElementById('ecgInterpretation').textContent = interpretationText;
    
    // Generate BMI Analysis
    const bmiDescription = `The calculated Body Mass Index (BMI) is ${bmiResult.bmi}, which falls within the ${bmiResult.classification.toLowerCase()} category according to WHO classification.${bmiResult.classification === 'Overweight' || bmiResult.classification === 'Obese' ? ' Elevated BMI may increase cardiovascular risk and should be interpreted alongside clinical findings and lifestyle factors.' : ' This value is within the recommended range for optimal health outcomes.'}`;
    document.getElementById('bmiResult').innerHTML = `
        <div class="bmi-value-large">
            <span class="bmi-number">${bmiResult.bmi}</span>
            <span class="bmi-label">BMI</span>
        </div>
        <div class="bmi-description">
            <strong>${bmiResult.classification}</strong><br>
            ${bmiDescription}
        </div>
    `;
    
    // Generate Clinical Insight with detailed analysis
    let clinicalInsight = [];
    
    // Cardiac assessment - reuse variables from above (no need to redeclare)
    // hr, pr, qrs, qt, axis already defined above for interpretation
    
    let cardiacIssues = [];
    let cardiacNormal = true;
    
    if (hr && !isNaN(hr)) {
        if (hr < 60 || hr > 100) {
            cardiacIssues.push("Heart rate abnormality (" + (hr < 60 ? "bradycardia" : "tachycardia") + ")");
            cardiacNormal = false;
        }
    }
    
    if (pr && !isNaN(pr)) {
        if (pr > 200) {
            cardiacIssues.push("AV conduction delay (prolonged PR)");
            cardiacNormal = false;
        }
    }
    
    if (qrs && !isNaN(qrs)) {
        if (qrs >= 120) {
            cardiacIssues.push("Ventricular conduction delay (wide QRS)");
            cardiacNormal = false;
        }
    }
    
    if (qt && !isNaN(qt)) {
        if (qt > 440) {
            cardiacIssues.push("Prolonged repolarization");
            cardiacNormal = false;
        }
    }
    
    if (axis && axis !== 'Normal Axis') {
        cardiacIssues.push("Axis deviation (" + axis + ")");
        cardiacNormal = false;
    }
    
    // Build clinical insight based on findings
    if (cardiacNormal && bmiResult.classification === 'Normal Weight') {
        clinicalInsight.push("The patient demonstrates normal cardiac electrical activity and healthy body weight. No immediate cardiovascular concerns based on the provided parameters.");
    } else if (cardiacNormal && bmiResult.classification === 'Underweight') {
        clinicalInsight.push("ECG parameters are within normal limits. However, BMI indicates underweight status, which may be associated with malnutrition or chronic disease. Nutritional assessment is recommended.");
    } else if (cardiacNormal && bmiResult.classification === 'Overweight') {
        clinicalInsight.push("ECG parameters are within normal limits. However, BMI indicates overweight, which may increase risk for cardiovascular disease, diabetes, or hypertension. Lifestyle modifications including regular exercise and balanced diet are recommended.");
    } else if (cardiacNormal && bmiResult.classification === 'Obese') {
        clinicalInsight.push("ECG parameters are within normal limits. However, BMI indicates obesity, which significantly increases risk of cardiovascular and metabolic disorders. Comprehensive weight management is strongly recommended.");
    } else if (!cardiacNormal) {
        clinicalInsight.push("The following cardiac findings require attention: " + cardiacIssues.join(", ") + ". Further clinical evaluation is recommended.");
        
        // Add BMI context
        if (bmiResult.classification === 'Overweight' || bmiResult.classification === 'Obese') {
            clinicalInsight.push("Additionally, BMI indicates " + bmiResult.classification.toLowerCase() + ", which may compound cardiovascular risk factors.");
        } else if (bmiResult.classification === 'Underweight') {
            clinicalInsight.push("BMI also indicates underweight status, which may require nutritional evaluation.");
        }
    }
    
    // Final recommendation
    clinicalInsight.push("This analysis is for educational purposes only. Please consult a qualified healthcare provider for proper clinical evaluation, diagnosis, and management.");
    
    document.getElementById('clinicalInsight').textContent = clinicalInsight.join(" ");
    
    // Generate Medical Summary
    const summaryText = `This report has been automatically generated by the ECG Smart Calculator system based on the provided patient data and ECG measurements. It is intended for educational and preliminary analysis purposes only and must be interpreted by a qualified healthcare professional before any clinical decision is made.`;
    document.getElementById('medicalSummary').textContent = summaryText;
    
    // Show the report
    document.getElementById('medicalReport').style.display = 'block';
    
    // Scroll to the report
    document.getElementById('medicalReport').scrollIntoView({ behavior: 'smooth' });
}

// Download Report as PDF (using browser print to save as PDF)
function downloadReport() {
    window.print();
}

// Print Report
function printReport() {
    window.print();
}


