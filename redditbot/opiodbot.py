import praw
import pdb
import re
import os


reddit = praw.Reddit(client_id='0qp_e119xLGMxw',
                     client_secret='KmeCcpXoJVxYWJqg7IoLzbDEPLg',
                     user_agent='OpioidBot by /u/MinimumHippo',
                     username='MinimumHippo',
                     password='Turtle98')

subreddit = reddit.subreddit("test") #TODO: change to all relevant subreddits

for submission in subreddit.hot(limit=1):
    print(submission.title)

    # Reply to the post
    submission.reply("Oh no don't relapse!! Download this super userful app")
    print("Bot replying to : ", submission.title)
