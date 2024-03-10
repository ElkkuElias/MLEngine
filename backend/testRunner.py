import unittest
import xmlrunner

def run_tests():
    """Runs the unittest test suite and outputs JUnit XML reports."""
    # Define the directory where Junit XML reports go
    output_dir = 'test-reports'

    # Discover and load all unittest test cases
    loader = unittest.TestLoader()
    suite = loader.discover('tests', pattern='Test*.py')

    # Run the test and output to JUnit XML in the specified directory
    xmlrunner.XMLTestRunner(output=output_dir).run(suite)

if __name__ == '__main__':
    run_tests()
