const boredApiUrl = "https://www.boredapi.com/api/activity";

const myPlan = document.getElementById("myPlan");

makePlanBtn.addEventListener("click", function(event) {
  event.preventDefault();

  let typeQ = "";
  document.getElementsByName("type").forEach(elem => {
    if (elem.checked) typeQ = elem.value;
  });

  const accessibility = document.getElementById("accessibility").value;

  axios
    .get(
      `${boredApiUrl}/?type=${typeQ}&minaccessibility=0&maxaccessibility=${accessibility}`
    )
    .then(({ data }) => {
      myPlan.innerHTML = ``;
      myPlan.innerHTML += `
      <form action="/plans" method="post">
        <div class="form-group">
          <label for="activityForm">Activity</label>
          <input id="activityForm" type="text" name="activityForm" value="${data.activity}">
        </div>

        <div class="form-group">
          <label for="typeForm">Type</label>
          <input id="typeForm" type="text" name="typeForm" value="${data.type}">
        </div>

        <div class="form-group">
          <label for="linkForm">Link</label>
          <input id="linkForm" type="text" name="linkForm" value="${data.link}">
        </div>

        <button class="btn btn-primary" type="submit">Save this Plan!</button>
    </form>
    `;
    });
});