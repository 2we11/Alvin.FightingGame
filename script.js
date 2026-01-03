const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player, enemy, cursors, spaceKey, playerHealthText, enemyHealthText;

function preload() {
    // Tidak perlu load gambar, gunakan bentuk geometri
}

function create() {
    // Tambah tanah sebagai rectangle
    this.add.rectangle(400, 580, 800, 50, 0x8B4513); // Coklat untuk tanah

    // Buat pemain sebagai rectangle merah
    player = this.physics.add.sprite(100, 450, null);
    player.setDisplaySize(50, 50);
    player.setTint(0xff0000); // Merah
    player.setCollideWorldBounds(true);
    player.health = 100;

    // Buat musuh sebagai rectangle biru
    enemy = this.physics.add.sprite(700, 450, null);
    enemy.setDisplaySize(50, 50);
    enemy.setTint(0x0000ff); // Biru
    enemy.setCollideWorldBounds(true);
    enemy.health = 100;

    // Kontrol keyboard
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Kontrol touch untuk HP: Sentuh untuk gerak dan pukul
    this.input.on('pointerdown', (pointer) => {
        // Gerak ke arah sentuhan (kiri/kanan)
        if (pointer.x < 400) { // Kiri layar
            player.setVelocityX(-160);
        } else { // Kanan layar
            player.setVelocityX(160);
        }
        // Lompat jika sentuh atas
        if (pointer.y < 300 && player.body.touching.down) {
            player.setVelocityY(-330);
        }
        // Pukul jika dekat musuh
        if (Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 100) {
            enemy.health -= 10;
        }
    });

    // UI Health
    playerHealthText = this.add.text(10, 10, 'Health Pemain: ' + player.health, { fontSize: '20px', fill: '#000' });
    enemyHealthText = this.add.text(600, 10, 'Health Musuh: ' + enemy.health, { fontSize: '20px', fill: '#000' });
}

function update() {
    // Reset velocity horizontal
    player.setVelocityX(0);

    // Gerak pemain (WASD atau arrow keys)
    if (cursors.left.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A))) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D))) {
        player.setVelocityX(160);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Pukul dengan Space
    if (Phaser.Input.Keyboard.JustDown(spaceKey) && Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 100) {
        enemy.health -= 10;
    }

    // AI musuh sederhana: gerak ke pemain
    if (enemy.x < player.x - 50) {
        enemy.setVelocityX(50);
    } else if (enemy.x > player.x + 50) {
        enemy.setVelocityX(-50);
    } else {
        enemy.setVelocityX(0);
    }

    // Update UI Health
    playerHealthText.setText('Health Pemain: ' + player.health);
    enemyHealthText.setText('Health Musuh: ' + enemy.health);

    // Cek kemenangan
    if (player.health <= 0) {
        this.add.text(400, 300, 'Kalah!', { fontSize: '40px', fill: '#ff0000' }).setOrigin(0.5);
        this.physics.pause(); // Pause game
    } else if (enemy.health <= 0) {
        this.add.text(400, 300, 'Menang!', { fontSize: '40px', fill: '#00ff00' }).setOrigin(0.5);
        this.physics.pause();
    }
}