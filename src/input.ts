module Input {
    export module KB {
        export enum KEY {
            A = 65,
            D = 68,
            W = 87,
            S = 83,
            LEFT = 37,
            RIGHT = 39,
            UP = 38,
            DOWN = 40,
            ENTER = 13,
            SPACE = 32
        }

        var _isDown: boolean[] = [];
        var _isUp: boolean[] = [];
        var _wasDown: boolean[] = [];

        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }

        export function isDown(keyCode: KEY) {
            return (_isDown[keyCode]);
        }

        export function wasDown(keyCode: KEY) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return (result);
        }

        export function keyDown(event: any) {
            var keyCode = event.which;
            _isDown[keyCode] = true;
            if (_isUp[keyCode])
                _wasDown[keyCode] = true;
            _isUp[keyCode] = false;
        }

        export function keyUp(event: any) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
    }
}
