import slack_tunes as slts
from copy import deepcopy
import unittest
from unittest.mock import Mock


class Slack_tunes_test_with_mocking(unittest.TestCase):

    def test_check_song_with_mocking_with_output(self):

        #Mocking of spotify_song
        slts.spotify_song = Mock(return_value= 'Shakira - Waka Waka')

        #Mocking of update_status
        slts.update_status = Mock()

        #Checking of song
        testing_check_song = slts.check_song(None , True)

        #Testing
        self.assertEqual(testing_check_song, 'Shakira - Waka Waka')

    
        slts.spotify_song.assert_called_with()
        slts.update_status.assert_called_with(is_playing=True, text='Shakira - Waka Waka')

    def test_check_song_with_mocking_without_output(self):

        #Mocking of spotify_song
        slts.spotify_song = Mock(return_value=None)

        #Mocking of update_status
        slts.update_status = Mock()

        #Checking of song
        testing_check_song = slts.check_song()

        #Testing
        self.assertEqual(testing_check_song, None)

        slts.spotify_song.assert_called_with()
        slts.update_status.assert_not_called()

if __name__ == "__main__":	
  unittest.main(verbosity = 5)


