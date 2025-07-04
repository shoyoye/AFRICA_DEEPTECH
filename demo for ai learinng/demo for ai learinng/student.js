console.log("✅ student.js loaded");


let currentTopic = {};

// Load topic explanation and show Explain Again button
function loadTopic(subject, topic) {
  fetch("content/topics.json")
    .then(res => res.json())
    .then(data => {
      currentTopic = data[subject][topic];

      const explanationHTML = `
        <h2>${subject.toUpperCase()} - ${topic.replaceAll('_', ' ').toUpperCase()}</h2>
        <p>${currentTopic.explanation}</p>
        <button onclick="explainAgain()">🔁 Explain Again</button>
      `;

      document.getElementById("output").innerHTML = explanationHTML;
    })
    .catch(err => {
      document.getElementById("output").innerHTML = `<p>⚠️ Error loading topic: ${err}</p>`;
    });
}

// When Explain Again is clicked
function explainAgain() {
  if (currentTopic.explanation_alt) {
    const altHTML = `
      <div style="margin-top: 10px;">
        <p><strong>Another way to understand it:</strong></p>
        <p>${currentTopic.explanation_alt}</p>
      </div>
    `;
    document.getElementById("output").innerHTML += altHTML;
  } else {
    alert("🙁 No alternate explanation available for this topic.");
  }
}

// QUIZ LOADING FUNCTION (already working)
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

// Simulate saving recorded quiz score
function saveRecordedQuiz(score, total) {
  console.log(`📚 [Recorded] Score saved: ${score}/${total}`);
}
