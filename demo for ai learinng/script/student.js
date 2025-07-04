let currentTopic = {};

// Load topic explanation and alternate explanation
function loadTopic(subject, topic) {
  fetch("content/topics.json")
    .then(res => res.json())
    .then(data => {
      currentTopic = data[subject][topic];
      const explanation = currentTopic.explanation;
      document.getElementById("output").innerHTML = `
        <h2>${subject.toUpperCase()} - ${topic.replaceAll('_', ' ').toUpperCase()}</h2>
        <p>${explanation}</p>
        <button onclick="explainAgain()">🔁 Explain Again</button>
      `;
    });
}

// Show alternate explanation if available
function explainAgain() {
  if (currentTopic.explanation_alt) {
    document.getElementById("output").innerHTML += `
      <p><strong>Another way to understand it:</strong></p>
      <p>${currentTopic.explanation_alt}</p>
    `;
  } else {
    alert("🙁 No alternate explanation available yet.");
  }
}

// Start Practice or Recorded Quiz
function startQuiz(type) {
  fetch("content/quizzes.json")
    .then(res => res.json())
    .then(data => {
      const quiz = data[type];
      let quizHTML = `<h2>${type === 'practice' ? '📝 Practice Quiz' : '📚 Recorded Quiz'}</h2><form id="quizForm">`;

      quiz.forEach((q, index) => {
        quizHTML += `<div><p><strong>Q${index + 1}:</strong> ${q.question}</p>`;
        q.options.forEach(option => {
          quizHTML += `
            <label>
              <input type="radio" name="q${index}" value="${option}">
              ${option}
            </label><br>`;
        });
        quizHTML += `</div><br>`;
      });

      quizHTML += `<button type="submit">Submit</button></form><div id="quizResult"></div>`;
      document.getElementById("output").innerHTML = quizHTML;

      document.getElementById("quizForm").onsubmit = function(e) {
        e.preventDefault();
        let score = 0;

        quiz.forEach((q, index) => {
          const selected = document.querySelector(`input[name="q${index}"]:checked`);
          if (selected && selected.value === q.answer) {
            score++;
          }
        });

        const total = quiz.length;
        const resultMsg = `✅ You scored ${score} out of ${total}`;

        document.getElementById("quizResult").innerHTML = `<p>${resultMsg}</p>`;

        if (type === 'recorded') {
          saveRecordedQuiz(score, total);
        }
      };
    });
}

// Save recorded quiz score (local simulation)
function saveRecordedQuiz(score, total) {
  const quizRecord = {
    type: "Recorded Quiz",
    score: score,
    total: total,
    date: new Date().toLocaleString()
  };

  let reports = JSON.parse(localStorage.getItem("quizReports")) || [];
  reports.push(quizRecord);
  localStorage.setItem("quizReports", JSON.stringify(reports));

  alert("📚 Quiz recorded and saved to your report!");
}

// View Report Card
function viewReportCard() {
  const reports = JSON.parse(localStorage.getItem("quizReports")) || [];

  if (reports.length === 0) {
    document.getElementById("output").innerHTML = "<p>No recorded quizzes yet.</p>";
    return;
  }

  let reportHTML = "<h2>📈 Your Report Card</h2><ul>";

  reports.forEach((report, index) => {
    reportHTML += `<li>
      <strong>${index + 1}.</strong> ${report.type} - ${report.score}/${report.total} on ${report.date}
    </li>`;
  });

  reportHTML += "</ul>";
  document.getElementById("output").innerHTML = reportHTML;
}

// Ask AI (used by the ask AI input field)
function handleAskAI() {
  const question = document.getElementById("studentQuestion").value;
  document.getElementById("aiResponse").innerHTML = "EduLite AI is thinking...";

  askGemini(question).then(answer => {
    document.getElementById("aiResponse").innerHTML = `<p><strong>AI:</strong> ${answer}</p>`;
  });
}
