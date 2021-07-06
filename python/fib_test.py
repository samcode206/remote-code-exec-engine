import fib
import unittest

class TestStringMethods(unittest.TestCase):
    def test_fib_six(self):
        self.assertEqual(fib.fib(6), 8)
    def test_fib_basecase(self):
        self.assertEqual(fib.fib(1), 1)


if __name__ == '__main__':
    unittest.main()