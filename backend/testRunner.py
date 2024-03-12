import unittest
import xmlrunner
import coverage

def run_tests():
    """Runs the unittest test suite with coverage monitoring and outputs JUnit XML reports."""
    # Start coverage collection
    cov = coverage.coverage()
    cov.start()

    # Define the directory where Junit XML reports go
    output_dir = 'test-reports'

    # Discover and load all unittest test cases
    loader = unittest.TestLoader()
    suite = loader.discover('tests', pattern='Test*.py')

    # Run the test suite
    xmlrunner.XMLTestRunner(output=output_dir).run(suite)

    # Stop coverage collection
    cov.stop()
    cov.save()

    # Generate coverage reports
    cov.html_report()  # HTML report
    cov.report()  # Standard output report

if __name__ == '__main__':
    run_tests()