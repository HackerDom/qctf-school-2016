TinyVM
======
> ����� ���������� � �������������! ��� ����������� ������� ��� ������.

��������
--------
��������� ���� ���������, ������� ��������� �� ������������ �������� ������.
��������� ������������ ����� ������������� ����������� ������, ������ �� ������� ����������� ��������� ��������� ������� ���� �� �������� ������. ����� ������ �������� � ���� ��������� ������. ����� �� �������������, ��������� �������������� ������ ������������ � �������� ��������.

�����
-----
1. **vm.exe** - ����������� ����
2. **vm.c** - �������� ���
3. **vm_gen.py** - ��������� ��������� ������ ������ � ��������������� ������� ��� ������� �����
4. **solve.py** - ������ ��������� ��� �������������� �����

WriteUp
-------
1. ���������, ��� �������� �������� ���������: ������������� ������, ����� ����� ������������ ������ ��������� ��������� "Wrong", ��������� �����������.
2. ������� ���� � IDA Pro. ����� ����� ����� ����� �������� ��������� ����������: ������� ������ �� ����, ���� � ��������, ��� ��������� ��������� ("Welcome...", "Success...", "Wrong") � ��������� ������ "%37s".
3. �����, � ����� ����� ��������� ������������ ��� ������. ��� ������ ����� � ���� � �� �� �������, ��������, main().
4. �������������� ��� �������: �������� puts ��������� �����������, ������������� ������ ����� �� ����� 37 ��������, � ����� ���� ��� �����, �� ����������� ������ ������� ��������� ��������� � ������������ ������.
5. ���������� ������ ����: ��� ������� ��������� �� 0 �� ��������� ��������� (100) � ����� 2. �� ������ �������� ������� ���� ���� �������� �������� ������ s[i] � s[i+1] � �� ��� ���������� ���� ������� '0'. ����� � ����������� �� s[i+1] ��� �������� ��������� ������ input[s[i]] ����������� ���� �� ��������:
```
input[s[i]]++
input[s[i]] ^= 47
input[s[i]] -= 51
input[s[i]] *= 2
```
6. ������ ���� ���������� ���������� ������ � ��������� ������� ���� � � ����������� �� ���������� ����� ��������� ��������������� ���������.
7. ����, ����� �������� ������, ��������� ����������� �� ������������ ����� ������ ������ � ����� ���������� � �������� ��������������.