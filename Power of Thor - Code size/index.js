I=readline().split(' ');
X=I[2]-0;
Y=I[3]-0;
while(true){
    X+=E=I[0]<X?-1:I[0]>X?1:0;
    Y+=F=I[1]<Y?-1:I[1]>Y?1:0;
    print((F<0?'N':F>0?'S':'')+(E<0?'W':E>0?'E':''));
}