
// =======================
// NAVIGATION
// =======================
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// =======================
// GET USERNAME SAFELY
// =======================
const username = window.location.pathname.split("/").filter(Boolean)[0];

// =======================
// FETCH USER
// =======================
fetch(`/api/user/${username}`)
  .then(res => {
    if (!res.ok) throw new Error("User not found");
    return res.json();
  })
  .then(user => {
    // ---------- INTRO ----------
    document.getElementById("contactEmail").textContent = user.email;
    document.getElementById("contactPhone").textContent = user.contact || "Not provided";
    // ---------- SKILLS ----------
    const noSkillsText = document.getElementById("noSkillsText");
    const skillsGroups = document.getElementById("skillsGroups");
    const coreSkillsContainer = document.getElementById("coreSkills");
    const secondarySkillsContainer = document.getElementById("secondarySkills");

    coreSkillsContainer.innerHTML = "";
    secondarySkillsContainer.innerHTML = "";

    const core = user.skills?.core || [];
    const working = user.skills?.working || [];

    if (core.length === 0 && working.length === 0) {
      noSkillsText.style.display = "block";
      skillsGroups.style.display = "none";
    } else {
      noSkillsText.style.display = "none";
      skillsGroups.style.display = "block";

      core.forEach(skill => {
        const pill = document.createElement("span");
        pill.className = "skill-pill";
        pill.textContent = skill;
        coreSkillsContainer.appendChild(pill);
      });

      working.forEach(skill => {
        const pill = document.createElement("span");
        pill.className = "skill-pill secondary";
        pill.textContent = skill;
        secondarySkillsContainer.appendChild(pill);
      });
    }
    const linkedin = document.getElementById("contactLinkedin");
    if (user.linkedin) {
      linkedin.href = user.linkedin;
      linkedin.textContent = user.linkedin;
    } else {
      linkedin.style.display = "none";
    }
    document.getElementById("name").textContent = user.name;
    document.getElementById("degree-intro").textContent = user.degree;
    document.getElementById("degree-edu").textContent = user.degree;
    document.getElementById("email").textContent = user.email;

    document.getElementById("semester-intro").textContent =
      `${user.currentSemester} semester`;

    const resumeBtn = document.getElementById("resumeLink");
    if (user.resumeLink) {
      resumeBtn.href = user.resumeLink;
    } else {
      resumeBtn.style.display = "none";
    }

    // ---------- EDUCATION ----------
    document.getElementById("college").textContent = user.collegeName;
    document.getElementById("eduYears").textContent =
      `${user.admissionYear} – ${user.graduationYear}`;

    document.getElementById("semester-edu").textContent =
      `Current Semester: ${user.currentSemester}`;
    document.getElementById("stream").textContent = user.stream;
    document.getElementById("school").textContent =
      `12th Stream: ${user.twelfthStream} | 10th: ${user.tenthPercent}% | 12th: ${user.twelfthPercent}%`;

    // ---------- EXPERIENCE ----------
    const expContainer = document.getElementById("experienceList");
    expContainer.innerHTML = "";

    if (!user.experiences || !user.experiences.length) {
      expContainer.innerHTML = "<p>No prior experience</p>";
    } else {
      user.experiences.forEach(exp => {
        const div = document.createElement("div");
        div.className = "exp-card";
        div.innerHTML = `
          <h4>${exp.role}</h4>
          <span>${exp.company}</span>
          <span>${exp.from} → ${exp.to}</span>
        `;
        expContainer.appendChild(div);
      });
    }
  })
  .catch(err => {
    console.error("ACTUAL ERROR:", err);

    // Hide all pages
    document.querySelectorAll(".page").forEach(p =>
      p.classList.remove("active")
    );

    // Show not-found screen
    document.getElementById("not-found").classList.add("active");

    // Disable nav
    document.querySelector("nav").style.display = "none";
  });
