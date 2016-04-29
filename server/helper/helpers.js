function isInt(value) {

  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function fieldValidation(studentId, score, name, email, clicks) {
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

module.exports = {
  isInt: isInt,
  fieldValidation: fieldValidation,
  scoreValidation: scoreValidation
};
