using System;
using System.Linq;
using System.Text;

namespace DateReverse
{
    class Program
    {
        static Random rand = new Random(050616);
        static void Main(string[] args)
        {
            var now = DateTime.Now;
            Console.WriteLine(
                now.DayOfYear == 94 && now.Year == 2016 && now.DayOfWeek == DayOfWeek.Friday 
                ? GetFlag() 
                : "Sorry, try it another day");
        }

        static string GetFlag()
        {
            var value = new byte[]
            {
                156, 62, 233, 105, 196, 246, 143, 208, 55, 200, 146, 41, 147, 214, 246, 247, 240, 217, 184, 32, 7, 249, 108,
                188, 106, 239, 170, 245, 53, 24, 26, 53, 10, 145, 159, 61, 160
            };
            var key = Enumerable.Range(0, 37)
                .Select(x => (byte)rand.Next(255))
                .ToArray();
            var answer = value.Select((t, i) => (byte)(t ^ key[i])).ToArray();
            return Encoding.UTF8.GetString(answer);
        }
    }
}