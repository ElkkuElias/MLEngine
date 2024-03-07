import unittest
import xmlrunner

# Import  test modules

def run_tests():
    """Runs the unittest test suite and outputs a JUnit XML report."""
    # Defines the directory where you want to save the JUnit XML reports
    output_dir = 'test-reports'

    # Discovers and load all unittest test cases
    loader = unittest.TestLoader()
    suite = loader.discover('tests', pattern='Test*.py')

    # Rusn the tests and output to JUnit XML
    with open(f"{output_dir}/unittest_results.xml", "w") as output:
        xmlrunner.XMLTestRunner(output=output).run(suite)


if __name__ == '__main__':
    run_tests()
