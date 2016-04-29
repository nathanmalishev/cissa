function isInt(value) {

  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function fieldValidation(studentId,STUDENT_ID_MAX_LENGTH, score, name, email, clicks) {
  if (studentId === null || !isInt(studentId) || String(studentId).length != STUDENT_ID_MAX_LENGTH) {
    return false;
  }

  if (!isInt(score) || score === null) {
    return false;
  }

  if (name === null) {
    return false;
  }

  if (email === null) {
    return false;
  }

  if (clicks === null || clicks.length === 0) {
    return false;
  }

  return true;
}


function scoreValidation(clicks){
  var prev = clicks[0];
  if (prev.time > ((new Date).getTime() - 600)) {
    return false
  }

  clicks.forEach((elem)=> {
    if (elem.time < prev.time) {
      return false
    }

    if (elem.time - prev.time > 1500) {
      return false
    }

    if (elem.score < prev.score) {
      return false
    }

    if (elem.score > prev.score + 1) {
      return false
    }

    prev = elem;
  });
  if (clicks.length < score) {
    return false
  }

  if (clicks[0].score != 0) {
    return false
  }
  return true;

}


//hydrates the first scoreboard from the db
function initialiseScoreboard(db) {
  var board = {};
  db.collection('students').find().forEach(function (doc) {
    if (doc === null) {
      return board;
    }

    board[doc.studentId] = {
      name: doc.name,
      email: doc.email,
      studentId: doc.studentId,
      score: doc.score,
    };
  });

  return board;
}

function dataBaseModel(req, scoreboard) {
    return (
      scoreboard[req.body.studentId] = {
        email: req.body.email,
        name: req.body.name,
        score: req.body.score,
        studentId: req.body.studentId,
      }
    );
  };

module.exports = {
  isInt: isInt,
  fieldValidation: fieldValidation,
  scoreValidation: scoreValidation,
  initialiseScoreboard: initialiseScoreboard,
  dataBaseModel: dataBaseModel
};
