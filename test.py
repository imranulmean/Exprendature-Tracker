let_test='test string'
print(f'this is {let_test}')

n=0;
while n<5:
    n=n+1;
    print(f'count is now {n}');

arr=['test1', 'test2', 'test3']
for x in arr:
    print(x);
arr_len=len(arr)
for j in range(arr_len):
    print(f'current index: {j} and value is {arr[j]}')

def test_function(param):
    print(f'this is test {param}');

test_function('name')

class Person:

    def __init__(self, name, age):
        self.name=name
        self.age=age

    def jello2(self):
        print(f'name: {self.name}, age: {self.age}')

person =Person('jhonny',28)
person.jello2()
print(f'again person: {person.name}')
