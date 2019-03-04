
def update_status(is_playing, text=None):
    ## TODO: Someday this will update the user's Slack emoticon
    ##       to show what song she is currently listening to.
    ##       It will eventually return the response (whether there
    ##       was a successful update or not).
    ##       Parameters:
    ##           is_playing: boolean
    ##           text: artist name & song name, as a single string
    ##       Returns:
    ##           HTTP response whether Slack was successfully updated.
    pass


def spotify_song():
    ## TODO: Someday this will query the external app 'Spotify'
    ##       and return the artist name and song name of the current track.
    ##       Parameters: None
    ##       Returns:
    ##           String with artist name & song name, as a single string
    ##            (or None if unsuccessful).
    pass


def check_song(old_status=None, first_run=False):
    current_status = spotify_song()

    if not current_status:
        if old_status or first_run:
            print('Not currently playing')
            update_status(is_playing=False)
        return None

    if old_status == current_status:
        return current_status

    print('Current status: {0}'.format(current_status))
    update_status(is_playing=True, text=current_status)

    return current_status
