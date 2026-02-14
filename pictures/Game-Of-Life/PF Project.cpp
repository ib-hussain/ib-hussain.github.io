// Ibrahim Hussain
// AI-B
// 23I-2626
// PF Project
#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include<algorithm>
#include<ctime>
#include <fstream>
using namespace std;
// any file that should be added to be named as inputFile.txt
// "∧"  ‾ ℗   •   ■  ▯   ▮  ■
unsigned short int time_in_ms = 50;
//at three neighbours only cell is born, at two it stays alive, even at three it stays alive, 
//anything except 3 and 2 kills it
//file writing
//dynamic display
void starts();
void printing_press(int iteration, int *first, int *second);
int reading_input(int *well);
void writinng_to(int *writer, int g);

void main_work(){
    int mn1[20][20] = {
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 } };
    int mn2[20][20] = {
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }, 
                                {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 } };
    int generations=0, neighbours=0 ;
    char start=0;
    generations = reading_input(&mn1[0][0]);
    //after the input is put into first array, it will be displayed and then start of game will happen
    printing_press(0, &mn1[0][0], &mn2[0][0]); 
    while(1){
        cout<<"\nPress S to start: "; cin>>start;
        if((start=='s')||(start=='S')){
            break;
        }
        cout<<"Try again"<<endl;
        // starts();
    }
    int for_temporary_iterate1=0, for_temporary_iterate2=0;
    bool for_temp_iterate1=false, for_temp_iterate2=false, its_time=false, its_time2=false;
    // change starts here ..................................................................................................................................................................................................................................................................................
    for(int iterate=1;iterate<=generations;iterate++){
        //changing code
        if((iterate%2)==1){
            for(int reset=0;reset<20;reset++){
                for(int reset1=0;reset1<20;reset1++){
                    mn2[reset][reset1] = 0;
                }
            }
            for(int b=0;b<20;b++){
                for(int c=0;c<20;c++){
                    neighbours=0;
                    if(mn1[b][c]==1){
                        //check if at bound
                        // if((b==19)||(c==19)){
                        //     for_temporary_iterate1=iterate;
                        //     for_temp_iterate1 =true;
                        // }
                        // if(for_temp_iterate1==true){
                        //     for(int reset=0;reset<20;reset++){
                        //         for(int reset1=0;reset1<20;reset1++){
                        //             mn2[reset][reset1] = 0;
                        //         }
                        //     }
                        //     break;
                        // }
                        
                        if((b>0)&&(c>0)){
                            if(mn1[b-1][c-1]==1){
                               neighbours++; 
                            }
                        }
                        if(b>0){
                            if(mn1[b-1][c]==1){
                                neighbours++;
                            }
                        }
                        if((b>0)&&(c<19)){
                            if(mn1[b-1][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if(c>0){
                            if(mn1[b][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(c<19){
                            if(mn1[b][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c>0)){
                            if(mn1[b+1][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(b<19){
                            if(mn1[b+1][c]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c<19)){
                            if(mn1[b+1][c+1]==1){
                                neighbours++;
                            }
                        }
                        
                        
                        if(neighbours<2){
                            mn2[b][c]=0;
                        }
                        if(neighbours==2){
                            mn2[b][c]=1;
                        }
                        if(neighbours==3){
                            mn2[b][c]=1;
                        }
                        if(neighbours>3){
                            mn2[b][c]=0;
                        }
                    }
                    else if(mn1[b][c]==0){
                        if((b>0)&&(c>0)){
                            if(mn1[b-1][c-1]==1){
                               neighbours++; 
                            }
                        }
                        if(b>0){
                            if(mn1[b-1][c]==1){
                                neighbours++;
                            }
                        }
                        if((b>0)&&(c<19)){
                            if(mn1[b-1][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if(c>0){
                            if(mn1[b][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(c<19){
                            if(mn1[b][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c>0)){
                            if(mn1[b+1][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(b<19){
                            if(mn1[b+1][c]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c<19)){
                            if(mn1[b+1][c+1]==1){
                                neighbours++;
                            }
                        }
                        
                        if(neighbours<2){
                            mn2[b][c]=0;
                        }
                        if(neighbours==2){
                            mn2[b][c]=0;
                        }
                        if(neighbours==3){
                            mn2[b][c]=1;
                        }
                        if(neighbours>3){
                            mn2[b][c]=0;
                        }
                    }
                }
                if(for_temp_iterate1==true){
                    break;
                }
            }
            // if(for_temp_iterate1!=true){
            printing_press(iterate, &mn1[0][0], &mn2[0][0]);
            auto startTime = std::chrono::steady_clock::now();
            std::srand(static_cast<unsigned int>(std::time(nullptr)));
            std::this_thread::sleep_for(std::chrono::milliseconds(time_in_ms/2));
            // }
            // if(for_temp_iterate1==true){
            //     its_time=true;
            // }
        }
        //change code pt2
        else if((iterate%2)==0){
            //reset the array to 0;
            for(int reset=0;reset<20;reset++){
                for(int reset1=0;reset1<20;reset1++){
                    mn1[reset][reset1] = 0;
                }
            }
            
            for(int b=0;b<20;b++){
                for(int c=0;c<20;c++){
                    neighbours=0;
                    if(mn2[b][c]==1){
                        if((b>0)&&(c>0)){
                            if(mn2[b-1][c-1]==1){
                               neighbours++; 
                            }
                        }
                        if(b>0){
                            if(mn2[b-1][c]==1){
                                neighbours++;
                            }
                        }
                        if((b>0)&&(c<19)){
                            if(mn2[b-1][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if(c>0){
                            if(mn2[b][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(c<19){
                            if(mn2[b][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c>0)){
                            if(mn2[b+1][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(b<19){
                            if(mn2[b+1][c]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c<19)){
                            if(mn2[b+1][c+1]==1){
                                neighbours++;
                            }
                        }
                        
                        if(neighbours<2){
                            mn1[b][c]=0;
                        }
                        if(neighbours==2){
                            mn1[b][c]=1;
                        }
                        if(neighbours==3){
                            mn1[b][c]=1;
                        }
                        if(neighbours>3){
                            mn1[b][c]=0;
                        }
                    }
                    else if(mn2[b][c]==0){
                        if((b>0)&&(c>0)){
                            if(mn2[b-1][c-1]==1){
                               neighbours++; 
                            }
                        }
                        if(b>0){
                            if(mn2[b-1][c]==1){
                                neighbours++;
                            }
                        }
                        if((b>0)&&(c<19)){
                            if(mn2[b-1][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if(c>0){
                            if(mn2[b][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(c<19){
                            if(mn2[b][c+1]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c>0)){
                            if(mn2[b+1][c-1]==1){
                                neighbours++;
                            }
                        }
                        if(b<19){
                            if(mn2[b+1][c]==1){
                               neighbours++; 
                            }
                        }
                        if((b<19)&&(c<19)){
                            if(mn2[b+1][c+1]==1){
                                neighbours++;
                            }
                        }
                        
                        if(neighbours<2){
                            mn1[b][c]=0;
                        }
                        if(neighbours==2){
                            mn1[b][c]=0;
                        }
                        if(neighbours==3){
                            mn1[b][c]=1;
                        }
                        if(neighbours>3){
                            mn1[b][c]=0;
                        }
                    }
                }
            }
            printing_press(iterate, &mn1[0][0], &mn2[0][0]);
            auto startTime = std::chrono::steady_clock::now();
            std::srand(static_cast<unsigned int>(std::time(nullptr)));
            std::this_thread::sleep_for(std::chrono::milliseconds(time_in_ms/2));
        }
    }
    if((generations%2)==1){
        writinng_to(&mn2[0][0], generations);
    }
    else if((generations%2)==0){
        writinng_to(&mn1[0][0], generations);
    }
}

//*********************************************************************************************************************************************************************************************************//
int main(){
    starts();
    return 0;
}

bool due=true;
void printing_press(int iteration, int *first, int *second){
    iteration++;
    // int highesty=0, highestx=0;
    // for(int d=0;d<400;d=d+20){
    //     for(int e=0;e<20;e++){
    //         if(1==*(first+d+e)){
    //             if(e>highestx){
    //                 highestx=e;
    //             }
    //             if(((d/20))>highesty){
    //                 highesty=((d/20));
    //             }
    //         }
    //     }
    // }
    //checks in place
    if((iteration==1)&&(due==true)){
        // system("clear");
        // cout<<"\n\n\t\t\t";
        // for(int abc=0;abc<=(highestx+4);abc++){cout<<"_";}
        // cout<<endl;
        // for(int d=0;d<=(20*highesty);d=d+20){
        //     cout<<"\t\t\t| ";
        //     for(int e=0;e<=(highestx);e++){
        //         if(1==*(first+d+e)){
        //             cout<<"▯";
        //         }
        //         else if(0==*(first+d+e)){
        //             cout<<" ";
        //         }
        //     }
        //     cout<<" |"<<endl;
        // }
        // cout<<"\t\t\t";
        // for(int abc=0;abc<=(highestx+4);abc++){cout<<"‾";}
        // cout<<endl;
        
        system("clear");
        cout<<"\n\n\t\t\t";
        for(int abc=0;abc<24;abc++){cout<<"_";}
        cout<<endl;
        for(int d=0;d<400;d=d+20){
            cout<<"\t\t\t| ";
            for(int e=0;e<20;e++){
                if(1==*(first+d+e)){
                    cout<<"▯";
                }
                else if(0==*(first+d+e)){
                    cout<<" ";
                }
            }
            cout<<" |"<<endl;
        }
        cout<<"\t\t\t";
        for(int abc=0;abc<24;abc++){cout<<"‾";}
        cout<<endl;
        due =false;
    }
    //for first array printing
    else if((iteration%2)==1){
        auto startTime = std::chrono::steady_clock::now();
        std::srand(static_cast<unsigned int>(std::time(nullptr)));
        std::this_thread::sleep_for(std::chrono::milliseconds(time_in_ms/2));
        // clear da screen
        // system("clear");
        // cout<<"\n\n\t\t\t";
        // for(int abc=0;abc<=(highestx+4);abc++){cout<<"_";}
        // cout<<endl;
        // for(int d=0;d<=(20*highesty);d=d+20){
        //     cout<<"\t\t\t| ";
        //     for(int e=0;e<=(highestx);e++){
        //         if(1==*(first+d+e)){
        //             cout<<"▯";
        //         }
        //         else if(0==*(first+d+e)){
        //             cout<<" ";
        //         }
        //     }
        //     cout<<" |"<<endl;
        // }
        // cout<<"\t\t\t";
        // for(int abc=0;abc<=(highestx+4);abc++){cout<<"‾";}
        
        system("clear");
        cout<<"\n\n\t\t\t";
        for(int abc=0;abc<24;abc++){cout<<"_";}
        cout<<endl;
        for(int d=0;d<400;d=d+20){
            cout<<"\t\t\t| ";
            for(int e=0;e<20;e++){
                if(1==*(first+d+e)){
                    cout<<"▯";
                }
                else if(0==*(first+d+e)){
                    cout<<" ";
                }
            }
            cout<<" |"<<endl;
        }
        cout<<"\t\t\t";
        for(int abc=0;abc<24;abc++){cout<<"‾";}
        cout<<endl<<"\t\t\tGeneration count: "<<iteration-1<<endl<<"\t\t\tGenerational intervals of "<<time_in_ms<<" milliseconds\n";
    }
    //for second array printing
    else if((iteration%2)==0){
        auto startTime = std::chrono::steady_clock::now();
        std::srand(static_cast<unsigned int>(std::time(nullptr)));
        std::this_thread::sleep_for(std::chrono::milliseconds(time_in_ms/2));
        // clear da screen
        // system("clear");
        // cout<<"\n\n\t\t\t";
        // for(int abc=0;abc<=(highestx+4);abc++){cout<<"_";}
        // cout<<endl;
        // for(int d=0;d<=(20*highesty);d=d+20){
        //     cout<<"\t\t\t| ";
        //     for(int e=0;e<=(highestx);e++){
        //         if(1==*(first+d+e)){
        //             cout<<"▯";
        //         }
        //         else if(0==*(first+d+e)){
        //             cout<<" ";
        //         }
        //     }
        //     cout<<" |"<<endl;
        // }
        // cout<<"\t\t\t";
        // for(int abc=0;abc<=(highestx+4);abc++){cout<<"‾";}
        
        system("clear");
        cout<<"\n\n\t\t\t";
        for(int abc=0;abc<24;abc++){cout<<"_";}
        cout<<endl;
        for(int f=0;f<400;f=f+20){
            cout<<"\t\t\t| ";
            for(int g=0;g<20;g++){
                if(1==*(second+f+g)){
                    cout<<"▯";
                }
                else if(0==*(second+g+f)){
                    cout<<" ";
                }
            }
            cout<<" |"<<endl;
        }
        cout<<"\t\t\t";
        for(int abc=0;abc<24;abc++){cout<<"‾";}
        cout<<endl<<"\t\t\tGeneration count: "<<iteration-1<<endl<<"\t\t\tGenerational intervals of "<<time_in_ms<<" milliseconds\n";
    }
    
}

int reading_input(int *well){
    int x, y;
    bool check=true;
    int Cells, Generations;
    ifstream in("inputFile.txt");
    in>>Generations;
    if(Generations>-1){
        in>>Cells;
        if((Cells>-1)&&(Cells<400)){
            for (int i = 1; i <=Cells; i++){
                in >> x >> y;
                if((x>-1)&&(x<20)&&(y>-1)&&(y<20)){
                *(well+(y*20)+x) =1;
                }
                else{
                    i++;
                }
            }
            in.close();
            return Generations;
        }
        else{
            cout<<endl<<"Amount of cells entered in file is invalid"<<endl;
        }
    }
    else{
        cout<<endl<<"Amount of generations entered in file is invalid"<<endl;
    }
    in.close();
    return 0;
}

void writinng_to(int *writer, int g){
    ofstream output("outputFile.txt");
    // for(){
    //     for(){
    //         out <<"Alive cells: "<<g<<endl;
    //     }
    // }
    output<<"Generations: "<<g<<endl;
    int counter=0;
    for(int h = 0;h<400;h=h+20){
        for (int i =0;i<20;i++){
            if(*(writer+h+i)==1){
                counter++;
            }
        }
    }
    output<<"Alive cells: "<<counter<<endl;
    int x=-1, y=-1;
    for(int j = 0;j<400;j=j+20){
        for (int k =0;k<20;k++){
            if(*(writer+j+k)==1){
                output<<(j/20)<<" "<<k<<endl;
            }
        }
    }
    output.close();
}
void starts(){
    main_work();
}
//only 1,0 printing
// void printing_press(int iteration, int *first, int *second){
//     auto startTime = std::chrono::steady_clock::now();
//     std::srand(static_cast<unsigned int>(std::time(nullptr)));
//     std::this_thread::sleep_for(std::chrono::milliseconds(time_in_ms/2));
//     // clear da screen
//     system("clear");
//     //for first array printing
//     if((iteration%2)==1){
//         cout<<"\n\n\t\t\t";
//         for(int abc=0;abc<24;abc++){cout<<"_";}
//         cout<<endl;
//         for(int d=0;d<400;d=d+20){
//             cout<<"\t\t\t| ";
//             for(int e=0;e<20;e++){
//                 cout<<*(first+d+e);
//             }
//             cout<<" |"<<endl;
//         }
//         cout<<"\t\t\t";
//         for(int abc=0;abc<24;abc++){cout<<"‾";}
//         cout<<endl;
//     }
//     //for second array printing
//     else if((iteration%2)==0){
//         cout<<"\n\n\t\t\t";
//         for(int abc=0;abc<24;abc++){cout<<"_";}
//         cout<<endl;
//         for(int f=0;f<400;f=f+20){
//             cout<<"\t\t\t| ";
//             for(int g=0;g<20;g++){
//                 cout<<*(second+f+g);
//             }
//             cout<<" |"<<endl;
//         }
//         cout<<"\t\t\t";
//         for(int abc=0;abc<24;abc++){cout<<"‾";}
//         cout<<endl;
//     }
// }
