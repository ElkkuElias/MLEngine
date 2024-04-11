import unittest
from translations import translate

class TestTranslations(unittest.TestCase):

    def test_translate_english(self):
        self.assertEqual(translate('Informaatioteknologia', 'en'), 'Information Technology')

    def test_translate_finnish(self):
        self.assertEqual(translate('Informaatioteknologia', 'su'), 'Informaatioteknologia')

    def test_translate_telugu(self):
        self.assertEqual(translate('Informaatioteknologia', 'tel'), 'సమాచార సాంకేతికత')

    def test_translate_not_found(self):
        self.assertEqual(translate('Nonexistent Term', 'en'), "Translation for 'Nonexistent Term' in language 'en' not found.")

