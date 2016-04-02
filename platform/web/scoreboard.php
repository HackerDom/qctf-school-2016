<?php

    require_once 'db.php';

?>
<table class="scoreboard">
    <tr>
        <th>Место</th><th>Команда</th><th>Баллы</th>
    </tr>
    <?php
        $scoreboard = get_scoreboard();
        $index = 1;
        foreach ($scoreboard as $row)
        {
            ?>
            <tr>
                <td class="place"><?= $index ?>.</td>
                <td class="team">
                    <?= htmlspecialchars($row['name']) ?>
                    <div class="location">
                        <?= htmlspecialchars($row['location']) ?>
                    </div>
                </td>
                <td>
                    <?= $row['tasks_count'] ?>
                </td>
            </tr>            
            <?php
            $index += 1;
        }
    ?>
</table>