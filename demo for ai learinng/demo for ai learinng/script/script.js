function loadTopic(subject, topic) {
  fetch('content/topics.json')
    .then(response => response.json())
    .then(data => {
      const text = data[subject][topic].explanation;
      document.getElementById('output').innerText = `${subject.toUpperCase()} - ${topic.replaceAll('_', ' ').toUpperCase()}\n\n${text}`;
    });
}

function startQuiz(mode) {
  fetch('quizzes/quiz_data.json')
    .then(response => response.json())
    .then(data => {
      const quiz = data.quiz;
      let html = `<h2>${mode === 'practice' ? 'Practice Quiz' : 'Recorded Quiz'}</h2>`;
      quiz.forEach((q, i) => {
        html += `<p>${q.question}</p>`;
        q.options.forEach(option => {
          html += `<label><input type="radio" name="q${i}" value="${option.charAt(0)}"> ${option}</label><br>`;
        });
      });
      html += `<button onclick="submitQuiz('${mode}')">Submit</button>`;
      document.getElementById('output').innerHTML = html;
    });
}

function submitQuiz(mode) {
  fetch('quizzes/quiz_data.json')
    .then(response => response.json())
    .then(data => {
      const quiz = data.quiz;
      let score = 0;
      quiz.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.answer) score++;
      });

      let result = `You scored ${score} out of ${quiz.length}`;

      if (mode === 'recorded') {
        result += "\n\n(Recorded for teacher's review — feature coming soon)";
      }

      document.getElementById('output').innerText = result;
    });
}
