$(".saveArticle").on("click", function () {
    var id = $(this).parents("li").data("articleID");
    $.ajax({
        method: "PUT",
        url: `/api/articles/${id}`,
        data: {saved: true}
    }).then (function (response) {
        window.location.assign("/saved");
    });
});

$(".deleteArticle").on("click", function() {
    var id = $(this).parents("li").data("articleID");
    $.ajax({
        method: "DELETE",
        url: `/api/articles/${id}`,
    }).then (function (response) {
        window.location.assign("/");
    });
});

$(".editNote, .addNote").on("click", function () {
    $(this).siblings("form").show();
    $(this).hide()
});

$(".editForm").on("submit", function(event) {
    event.preventDefault();
    var id = $(this).siblings(".note").data("noteId");
    var text = $(this).children("input").val().trim();
    $.ajax({
        method: "PUT",
        url: `/api/notes/${id}`,
        data: {text}
    }).then (function (response) {
        location.reload();
    })
});

$(".addForm").on("submit", function (event) {
    event.preventDefault();
    var articleID = $(this).parents("li").data("articleId");
    var text = $(this).children("input").val().trim();
    $.ajax({
        method: "POST",
        url: "/api/notes/",
        data: {
            articleId,
            text
        }
    }).then (function(response) {
        location.reload();
    })
})