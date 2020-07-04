$(document).ready(function() {
  $('.scrape').on('click', async function(event) {
    event.preventDefault();
    const scrape = await axios.get("/api/scrape");
    console.log("scrape: ", scrape);
    window.location.reload();
  });

  $(document).on('click', '[data-type="add-to-fav"]', async function(event) {
    event.preventDefault();
    await axios.put("/api/articles/" + $(this).attr('data-id'));
    window.location.href = "/";
  });

  $(document).on('click', '.add-comment', function(event) {
    event.preventDefault();
    $('#add-comment-button').attr('data-id', $(this).attr('data-id'));
    $('#add-comment-modal').modal("show");
  });

  $(document).on("click", "#add-comment-button", async function(event) {
    alert("hello");
    event.preventDefault();
    const comment = await axios.post('/api/comments/' + $('#add-comment-button').attr('data-id'), {
      name: $('#comment_name').val(),
      body: $('#comment_body').val()
    });
    $('#add-comment-modal').modal("hide");
    window.location.reload();
  });

  $(document).on('click', '[data-type="remove-comment"]', async function(event) {
    event.preventDefault();
    await axios.delete("/api/comments/" + $(this).attr('data-id'));
    window.location.reload();
  });
});
