import random
import inspect

class jar:
    def __init__(self, isWeighted: bool = False):
        self.content = []
        self.jar_size = 0
        self.isWeighted = isWeighted

    def move(self, content: list, size: int = 0, isWeighted: bool = False):
        self.content = content
        self.jar_size = size
        self.isWeighted = isWeighted

    def push(self, bullet: "bullet"):
        self.content.append(bullet)
        self.jar_size += 1
        if self.isWeighted:
            self.setListWeight()
    
    def pop(self):
        if self.jar_size == 0:
            return None
        self.jar_size -= 1
        return self.content.pop()
    
    def peek(self):
        if self.jar_size == 0:
            return None
        return self.content[-1]
    
    def isEmpty(self):
        return self.jar_size == 0
    
    def setWeighted(self):
        self.isWeighted = True
        self.setListWeight()

    def getWeighted(self, index: int):
        return self.content[index].weight
    
    def getTotWeight(self):
        return sum([bullet.weight for bullet in self.content])
    
    def getMaxWeight(self):
        return max(self.content, key=lambda x: x.weight).weight
    
    def getMinWeight(self):
        return min(self.content, key=lambda x: x.weight).weight
    
    def setListWeight(self):
        for bullet in self.content:
            bullet.addWeight()

    def shuffle(self):
        random.shuffle(self.content)

    def find(self, value):
        result = ""
        for i in range(self.jar_size):
            temp = self.pop()
            if temp.content == value:
                result = temp
                self.shuffle()
                break
            else:
                self.push(temp)
                self.shuffle()
        return result

    def union(self, jar: "jar"):
        if self.isWeighted:
            if self.getTotWeight() >= jar.getTotWeight():
                for bullet in jar.content:
                    self.push(bullet)
            else:
                for bullet in self.content:
                    jar.push(bullet)
                self.move(jar)
        else:
            for bullet in jar.content:
                self.push(bullet)
        self.jar_size = len(self.content)
        self.shuffle()
        return self
    
    def __str__(self):
        if self.jar_size == 0:
            return "Empty"
        else:
            return str([str(bullet) for bullet in self.content]) + f" size: ({self.jar_size}) weight: ({self.getTotWeight()})"
    
    def __repr__(self):
        return self.__str__()
    
    def __len__(self):
        return self.jar_size
    
class bullet:
    def __init__(self, content):
        self.content = content
        self.weight = 0

    def isEquals(self, bullet: "bullet"):
        return self.content == bullet.content
    
    def addWeight(self):
        self.weight += 1

    def subWeight(self):
        self.weight -= 1

    def sameWeight(self, bullet: "bullet"):
        return self.weight == bullet.weight
    
    def __str__(self):
        return f"{self.content} ({self.weight})"
    
def make_bullets(content) -> bullet:
    return bullet(content)
def make_jar(isWeighted = False) -> jar:
    return jar(isWeighted)

def compares(bullet1: bullet, bullet2: bullet) -> bool:
    return str(bullet1.content) >= str(bullet2.content)

def sort_jar(jar: jar):
    tempArray = []
    i = 0
    while not jar.isEmpty():
        tempBullet = jar.pop()
        try:
            if tempArray.__len__() == 0:
                tempArray.append(tempBullet)
            elif compares(tempBullet, tempArray[tempArray.__len__() - 1]):
                tempArray.append(tempBullet)
            elif tempArray.__len__() == 1:
                if not compares(tempBullet, tempArray[0]):
                    tempArray.insert(0, tempBullet)
                else:
                    tempArray.append(tempBullet)
            else:
                alength = len(tempArray)
                for j in reversed(range(alength)):
                    if not compares(tempBullet, tempArray[j]):
                        jar.push(tempArray.pop())
                        if (j == 0):
                            tempArray.insert(0, tempBullet)
                            break
                    else:
                        tempArray.append(tempBullet)
                        break
        except IndexError:
            print("Error" + str(IndexError))
            break
        i += 1
        jar.shuffle()

    return {"array": tempArray, "runs": i}

def create_jar(array, isWeighted: bool = False):
    jar = make_jar(isWeighted)
    if isinstance(array[0], bullet):
        for bullets in array:
            jar.push(bullets)
    else:
        for content in array:
            jar.push(make_bullets(content))
    return jar

def tunion(jar1, jar2, isWeighted: bool = False):
    union = jar1.union(jar2)
    return union

def sort(array, isWeighted: bool = False):
    sortedArray = []
    jar = create_jar(array, isWeighted)
    sortedArray = sort_jar(jar)
    sorted = make_jar(isWeighted)
    sorted.move(sortedArray["array"], sortedArray.__len__(), isWeighted)
    return {"array": sorted, "runs": sortedArray["runs"]}

def print_content(union: jar):
    for bullet in union.content:
        print(bullet, end=" ")
    print(f"runs: {union.jar_size}")

def main():
    
    inputs = input("Enter array, keep the values separated by space: \n")
    shouldWeight = input("Should the array be weighted? (y/n): \n")
    array = inputs.split(" ")
    jar1 = create_jar(array, shouldWeight.capitalize() == "Y")
    run = 1
    while(run == 1):
        choice = input("Which action do you like to do? (union/sort/find): \n")
    
        if (choice.capitalize() == "Union"):
            inputs2 = input("Enter array 2, keep the values separated by space: \n")
            shouldWeight2 = input("Should the array be weighted? (y/n): \n")
            array2 = inputs2.split(" ")
            print(array2)
            jar2 = create_jar(array2, shouldWeight2.capitalize() == "Y")
            union = tunion(jar1, jar2, shouldWeight.capitalize() == "Y")
            print_content(union)

        elif (choice.capitalize() == "Find"):
            value = input("Enter value to find: \n")
            result = jar1.find(value)
            if result is None:
                print("Value not found")
            else:
                print(f"Value found: {result}")

        elif (choice.capitalize() == "Sort"):
            sorted = sort(jar1.content, shouldWeight.capitalize() == "Y")
            print_content(sorted["array"])
            
        else:
            print("Invalid choice")
        run = input("Do you want to continue? (y/n): \n")
        if run.capitalize() == "Y":
            run = 1
        else:
            run = 0
            print("Bye")
main()