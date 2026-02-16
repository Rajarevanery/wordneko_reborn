
done:
-check for duplicate for the spelling, if its already in then we just redo the thing, an idea is that we
could just scramble the array and do the word one by one by index + 1, then we surely dont have any duplicate
-keyboard turns into yellow or green or black depending on how user already submit a word
-keyboard component not tracking, it updates bassed on the current secretword and the userguess
-remove change credential and move it to profile (so profile, statistics, change credential into one)
-profile and statistics (for user) make it one
-skip word but (-) lives but if the life is 1 then you cant skip a word
-fix the profile if the user doesnt have any "play" then it will run in a endless loop because it doesnt have any info of any of it, we can just fetch the user (by the user id) for the initial if its empty just display "none", and in the recent score too, just like "no scores"
-top score / session in any game in profile like in osu top 5 or sum
-for the edit profile / settings profile make sure to edit in the database table too, because it only changed in the auth side of supabase.
-redo login and register design, and in the register also make sure to make profile picture and also the country (for misc reasons like country ranking etc.)
-word history on classic wordle
-change scoring system (you could count this from the word length and the duration of that user worked on that specific word) for the wordle type game make sure to make the exp / score more much higher than spelling like 2x - 4x much more, this might be hard, check again for the how the score logic works in the leaderboard and all especially for the wordle one.
-hp on the classic wordle like in the spelling
-for the save vocabulary make sure the adding vocabulary list disabled if its already in that category.
-enable rls in the policies configuration in supabase after completing every functionality to the table
-user can save vocab and categorize them accordingly (like anki)
-rebrand to WordNeko 
-timed / speedrun score not uploaded
-stop timer after end game in the speedrun
-leaderboard weird ui
-refresh 404 error

onwork:
-refactor so it doesnt fetch data unnceseasrily make a center data for fetching and then just use that data
without ever when a user rerenders it fetches (so that doesnt happen)

PRIORTY:



fix:
category if click multiple times, it created multiple times