alert("FORM JS LOADED");
console.log("FORM.JS LOADED 100%");
// ===============================
// BASIC SELECTORS
// ===============================
const form = document.getElementById("portfolioForm");

const experienceBox = document.getElementById("experienceBox");
const experienceList = document.getElementById("experienceList");
const addExperienceBtn = document.getElementById("addExperience");

const experienceRadios = document.querySelectorAll(
    'input[name="hasExperience"]'
);

const admissionSelect = document.getElementById("admissionYear");
const graduationSelect = document.getElementById("graduationYear");

// ===============================
// ADMISSION & GRADUATION YEAR LOGIC
// ===============================

// populate admission years (2020–2035)
for (let year = 2020; year <= 2035; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    admissionSelect.appendChild(option);
}

// populate graduation years based on admission year
function updateGraduationYears(startYear) {
    graduationSelect.innerHTML = "";

    for (let year = startYear; year <= 2035; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        graduationSelect.appendChild(option);
    }
}

// initial load
updateGraduationYears(2020);

// update when admission year changes
admissionSelect.addEventListener("change", () => {
    updateGraduationYears(Number(admissionSelect.value));
});

// ===============================
// EXPERIENCE YES / NO TOGGLE
// ===============================
experienceRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes" && radio.checked) {
            experienceBox.classList.add("active");
        }

        if (radio.value === "no" && radio.checked) {
            experienceBox.classList.remove("active");

            // reset to only one experience block
            const firstItem = experienceList.querySelector(".experience-item");
            experienceList.innerHTML = "";
            experienceList.appendChild(firstItem);
        }
    });
});

// ===============================
// ADD MORE EXPERIENCE
// ===============================
addExperienceBtn.addEventListener("click", () => {
    const firstItem = experienceList.querySelector(".experience-item");
    const newItem = firstItem.cloneNode(true);

    // clear input values
    newItem.querySelectorAll("input").forEach((input) => {
        input.value = "";
    });

    experienceList.appendChild(newItem);
});

// ===============================
// FORM SUBMIT
// ===============================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED");

    const experiences = [];

    const companies = document.getElementsByName("companyName[]");
    const roles = document.getElementsByName("role[]");
    const fromDates = document.getElementsByName("from[]");
    const toDates = document.getElementsByName("to[]");

    for (let i = 0; i < companies.length; i++) {
        if (companies[i].value.trim() !== "") {
            experiences.push({
                company: companies[i].value,
                role: roles[i].value,
                from: fromDates[i].value,
                to: toDates[i].value
            });
        }
    }

    const data = {
        name: form.name.value,
        email: form.email.value,
        contact: form.contact.value,
        linkedin: form.linkedin.value,
        degree: form.degree.value,
        collegeName: form.collegeName.value,
        admissionYear: form.admissionYear.value,
        graduationYear: form.graduationYear.value,
        currentSemester: form.currentSemester.value,

        twelfthStream: form.twelfthStream.value,
        tenthPercent: form.tenthPercent.value,
        twelfthPercent: form.twelfthPercent.value,

        hasExperience: form.hasExperience.value,
        experiences
    };

    console.log("SENDING DATA:", data);

    // 🔥 THIS IS THE MISSING PART
    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            console.log("SERVER RESPONSE:", result);
            alert(result.message);
            form.reset();
        })
        .catch(err => {
            console.error("FETCH ERROR:", err);
            alert("Submission failed");
        });
});


form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED"); // 👈 ADD THIS
    const experiences = [];

    const companies = document.getElementsByName("companyName[]");
    const roles = document.getElementsByName("role[]");
    const fromDates = document.getElementsByName("from[]");
    const toDates = document.getElementsByName("to[]");

    for (let i = 0; i < companies.length; i++) {
        if (companies[i].value.trim() !== "") {
            experiences.push({
                company: companies[i].value,
                role: roles[i].value,
                from: fromDates[i].value,
                to: toDates[i].value
            });
        }
    }

    const data = {
        name: toTitleCase(form.name.value),
        email: form.email.value.toLowerCase(),
        skills: form.skills.value
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean),
        degree: form.degree.value.toUpperCase(),
        stream: form.stream.value.toUpperCase(),
        collegeName: toTitleCase(form.collegeName.value),

        admissionYear: form.admissionYear.value,
        graduationYear: form.graduationYear.value,
        currentSemester: form.currentSemester.value,

        contact: form.contact.value,
        linkedin: form.linkedin.value,

        experiences: experiences
    };

    console.log("FINAL PORTFOLIO DATA:", data);
});
function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
