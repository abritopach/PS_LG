#!/usr/bin/python

#Ejercicio 1

#Crear una funcion en python que dada una lista de numeros indique para cada numero si es
#un numero perfecto, abundante o defectivo.

#Un numero perfecto es aquel que es igual a la suma de sus divisores propios positivos,
#excluyendose a si mismo. Por ejemplo 6 = 1+2+3

#Un numero abundante es aquel que la suma de los divisores propios es mayor que el numero.

#Un numero defectivo es aquel que la suma de los divisores propios es menor que el numero.

#Se debera usar Python 2.7 y no se permitira el uso de librerias externas que obtengan la
#clasificacion del numero.

list = [0, 1, 6, 25, 34, 17, 9, 28, 496, 8128, 12, 18, 20, 24];

def get_number_type(list):

    list.remove(0);
    list.remove(1);

    for number in list:
        x = 1;
        sum = 0;
        list_divisors = [];
        while x != number:
            if number % x == 0:
                list_divisors.append(x);
                sum += x;
            x += 1;

        if sum == number:
            print number, 'es un numero perfecto y sus divisores propios son los numeros: ', list_divisors
        if sum > number:
            print number, 'es un numero abundante y sus divisores propios son los numeros: ', list_divisors
        if sum < number:
            print number, 'es un numero defectivo y sus divisores propios son los numeros: ', list_divisors

if __name__ == "__main__":
    #numbers = input("Introduce una lista de numeros. Ejemplo [23, 5, 23]: ");
    #numbers = map(int, numbers);
    #numbers.remove(0);
    #numbers.remove(1);
    #print numbers;
    #get_number_type(numbers);
    get_number_type(list);

